const express = require("express");
const connectDB = require("./config/database");
const app = express();

connectDB().then(()=>{
    console.log("Connected to Database");
    app.listen(3000,()=>{
        console.log("Server Started");
    })
}).catch(err=>{
    console.log("Something went wrong")
});

