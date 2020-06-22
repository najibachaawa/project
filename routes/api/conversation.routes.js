
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {readConversations,readMessages,sendMessage,postWebhook,getWebhook,assignConv,assignConvUser} = require('../../controllers/conversation.controller.js');
module.exports=(io)=>{
    router.get('/conversations/',passport.authenticate('jwt', { session: false }),readConversations);

router.get('/messages/:convId',readMessages);

router.post("/message/:recId",sendMessage)

router.post("/webhook",(req,res,next)=>{
    const message=req.body.entry[0].messaging[0]
    console.log(message)
    io.sockets.emit("message",message)
    next()
},postWebhook)
router.get("/webhook",getWebhook)
router.post("/assign",passport.authenticate('jwt', { session: false }),assignConv)
router.post("/assign-to",passport.authenticate('jwt', { session: false }),assignConvUser)

//router.use(isAdmin())

    return router
}




