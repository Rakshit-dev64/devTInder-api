const express = require("express");
const {userAuth} = require("../middlewares/auth")
const profileRouter = express.Router();

// get profile api
profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send(err.message);
    }
})

module.exports = profileRouter;