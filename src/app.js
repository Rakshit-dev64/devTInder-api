const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData, validateLoginData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

const app = express();

app.use(express.json());
app.use(cookieParser());

//add user
app.post("/signup",async(req,res)=>{
    try{
    // validate the data coming from request
    validateSignupData(req);

    // encrypt the password to hashcode
    const {firstName, lastName, emailId, password} = req.body; // extracting these field from req because writing req.body.firstName is a pain in the neck
    const passwordHash = await bcrypt.hash(password,10);// 10 is number of salt, it can be considered as the number of times the encyption procees is performed on the password

    //creating a new instance of User model (User model is the blueprint for the instancees)
    // const user = new User(req.body); //bday way because never trust req.body
    const user = new User({firstName, lastName, emailId, password : passwordHash})
        await user.save();
        res.send("User Added Successfully");
    } catch(err){
        res.status(400).send("Error saving the user :" + err.message)
    }
})

// login api
app.post("/login", async(req,res)=>{
    try{
        validateLoginData(req);
        const {emailId , password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            // create a jwt token
            const token = await jwt.sign({_id : user._id}, "SecretKey@998");
            // add the token to cookie and send response back to the user
            res.cookie("token",token);
            res.send("Logged in successfully");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }catch(err){
        res.status(400).send(err.message);

    }
})

// get profile api
app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send(err.message);
    }
})

connectDB().then(()=>{
    console.log("Connected to Database");
    app.listen(3000,()=>{
        console.log("Server Started");
    })
}).catch(err=>{
    console.log("Something went wrong")
});

