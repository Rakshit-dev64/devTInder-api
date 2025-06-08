const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")
const app = express();

app.use(express.json());

//add user
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

