const express = require("express");

const app = express();


app.get("/user",(req,res)=>{
    res.send({firstname:"Rakshit", lastname:"Tyagi"})
})
app.post("/user",(req,res)=>{
    res.send("Updated Successfully");
})

app.delete("/user",(req,res)=>{
    res.send("User Deleted");
})

app.listen(3000,()=>{
    console.log("Server started");
});