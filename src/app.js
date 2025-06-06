const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")
const app = express();

app.use(express.json());

app.post("/signup",async(req,res)=>{
    //creating a new instance of User model (User model is the blueprint for the instancees)
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added Successfully");
    } catch(err){
        res.status(400).send("Error saving the user :" + err.message)
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

