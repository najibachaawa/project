const axios=require('axios')
const {FACEBOOK}=require("../config/url")
const {TEST_ACCESS,PAGE_ID}=require("../config/keys")
const User = require("../models/User")
const mongoose=require("mongoose")

const requestUrl=(PSID,access_token)=>(`/${PSID}?fields=first_name,last_name,profile_pic&access_token=${access_token}`)

const getUsersImage=async (response)=>{
    return new Promise(async(resolve,reject)=>{
        const conversations=response.data.data

        const senders=conversations.map((conv)=>conv.senders.data[0])
    
        let batch=[]
        batch=senders.map((sender)=>({relative_url:requestUrl(sender.id,TEST_ACCESS),method:"GET"}))

        
    
        const responsee=await axios.post("https://graph.facebook.com?access_token="+TEST_ACCESS,{
            batch:batch
        })
    //    console.log(responsee)
        const profilesData=responsee.data.map((data)=>JSON.parse(data.body))
      resolve(profilesData)    
    })
}
const readConversations=async(req,res,err)=>{
    const response=await axios.get(`${FACEBOOK}${PAGE_ID}/conversations?access_token=${TEST_ACCESS}&fields=senders,updated_time`)
    const profilesData=await getUsersImage(response)
    let conversations_=response.data.data.map((data,index)=>({convid:data.id,...data.senders.data[0],updated_time:data.updated_time,image:profilesData[index].profile_pic,assignedTo:null}))
    const conversations={conversations:conversations_,paging:response.data.paging}
    const convsId=conversations_.map((conv)=>conv.convid)
    console.log(convsId)
    let assign_to_user=[]
    let users =await User.find({convs:{$in:convsId}})
    let users_=await User.find({_id:{$ne:req.user._id}},["_id","name"])
    assign_to_user=users.map((user)=>{
        let assignedConvIds=user.convs
        console.log(assignedConvIds)
        conversations_=conversations_.map((conv)=>{
       
            if(assignedConvIds.indexOf(conv.convid)>-1){
                conv.assignedTo=user._id
                console.log("CHGANGED ",user._id)
            }
                return conv
            
        })
    })

    
   


     return res.json({convs:conversations,user:req.user,users:users_})
   
}
const readMessages=(req,res,err)=>{
    const {convId}=req.params
    axios.get(`${FACEBOOK}${convId}/messages?access_token=${TEST_ACCESS}&fields=message,from,to,created_time`).then((response)=>{
 
        return res.json({messages:response.data.data.reverse()})
    }).catch((e)=>{
       // console.log(e.response.data)
    })
}

const readMoreMessages=(req,res,err)=>{
    axios.get(`${req.body.url}`).then((response)=>{
        return res.json({convs:response.data})
    })
}
const sendMessage=async (req,res,err)=>{
    const {recId}=req.params
    console.log(recId)
   try{
    await axios.post(`${FACEBOOK}me/messages?access_token=${TEST_ACCESS}`,{
        "messaging_type": "MESSAGE_TAG",
        "tag":"CONFIRMED_EVENT_UPDATE",
        "recipient": {
          "id": recId
        },
        "message": {
          "text": req.body.message
        }
      })
   }catch(e){
      console.log(e.response.data)
   }
     res.json({success:true})
 
}

const getWebhook=(req,res,err)=>{
   res.send(req.query["hub.challenge"])
}

const postWebhook=(req,res,err)=>{
 
    const message=req.body.entry[0].messaging[0]

    //console.log(message)
  // io.sockets.emit("message",message)
    res.send(200)
}
const assignConv=(req,res,err)=>{
    
    const userId=req.user._id
    const convId=req.body.convId
    console.log("req.user ",req.user._id)
   
    User.findOneAndUpdate({_id:userId},{$addToSet:{convs:convId}},{new:true},(err,user)=>{
        console.log(user)
    })

    
   // io.sockets.emit("message",message)
    res.send(200)
}
const assignConvUser=async(req,res,err)=>{
    
 
    const {convId,userId}=req.body
    console.log("req.user assignConvUser",userId)
   await User.findOneAndUpdate({_id:req.user._id},{$pull:{convs:convId}},{new:true},(err,user)=>{})
     
    
    User.findOneAndUpdate({_id:userId},{$addToSet:{convs:convId}},{new:true},(err,user)=>{
        console.log(user)
    })

    
   // io.sockets.emit("message",message)
    res.send(200)
}
module.exports={
    readConversations,
    readMessages,
    readMoreMessages,
    sendMessage,
    getWebhook,
    postWebhook,
    assignConv,
    assignConvUser
}