const axios=require('axios')
const {FACEBOOK}=require("../config/url")
const {TEST_ACCESS}=require("../config/keys")
const readConversation=(req,res,err)=>{
    axios.get(`${FACEBOOK}103718324649806/conversations?access_token=${TEST_ACCESS}`)
}