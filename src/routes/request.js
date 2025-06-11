const express = require("express");
const {userAuth} = require("../middlewares/auth")
const requestRouter = express.Router();
 
requestRouter.post("/sendConnectionReq", userAuth, async(req,res)=>{
    const user = req.user;
    console.log("Connection request came");
    res.send(user.firstName + " sent Connection request");
})

module.exports = requestRouter