const express = require("express");
const {userAuth} = require("../middlewares/authorization");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt")
const validator = require("validator"); 
const profileRouter = express.Router();

// get profile api
profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send(loggedInUser);

    }catch(err){
        res.status(400).send(err.message);
    }
})
// req - password 
profileRouter.patch("/password/reset",userAuth, async(req,res)=>{
    try{
        const {password} = req.body;
        if(!password){
            throw new Error("Password is required");
        }
        if(!validator.isStrongPassword(password)){
            throw new Error("Weak Password");
        }
        loggedInUser = req.user;
        loggedInUser.password = await bcrypt.hash(password,10)
        await loggedInUser.save();
        res.send("Password Changed");
    }catch(err){
        res.status(400).send(err.message);
    }

})

module.exports = profileRouter;