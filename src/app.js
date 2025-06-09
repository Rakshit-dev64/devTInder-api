const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData, validateLoginData} = require("./utils/validation");


const app = express();

app.use(express.json());

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
            res.send("Logged in successfully");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }catch(err){
        res.status(400).send(err.message);

    }
})
// get user by emailId
app.get("/user/email",async (req,res)=>{
    try{
        const user = await User.find({ emailId : req.body.emailId});
        if(user.length === 0){
            res.send("User not found");
        }
        else{
            res.send(user);
        }
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

// show all user || Feed API
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(404).send("Something went wrong")
    }

})

// find user by id (mongoDB id)
app.get("/user/id",async(req,res)=>{
    try{
        const user = await User.findById(req.body._id);
        res.send(user);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

// delete a user from database
app.delete("/user/:userId", async(req,res)=>{
    try{
        const userId = req.params?.userId
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

// update an user || patch API
app.patch("/user/:userId",async(req,res)=>{
    const data = req.body;
    const userId = req.params?.userId;
    try{
        const ALLOWED_UPDATES = ["password", "about", "gender", "profileURL", "skills",];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Can't add more than 10 skills");
        }
        // hard coded bad way
        // const user = await User.findByIdAndUpdate(req.body._id, {firstName : "Shiratori",lastName : "Kazuma"});
        const user = await User.findByIdAndUpdate(userId,data,{ runValidators : true } );
        console.log(user);
        res.send("User Updated");

    }catch(err){
        res.status(400).send("UPDATE FAILED :" + err.message);

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

