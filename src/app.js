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
app.delete("/user", async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.body._id);
        res.send("User Deleted Successfully");
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

// update an user || patch API
app.patch("/user",async(req,res)=>{
    const data = req.body;
    try{
        // hard coded bad way
        // const user = await User.findByIdAndUpdate(req.body._id, {firstName : "Shiratori",lastName : "Kazuma"});
        const user = await User.findByIdAndUpdate(req.body._id,data,{ runValidators : true } );
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

