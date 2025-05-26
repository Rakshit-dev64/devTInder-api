const express = require("express");

const app = express();

app.get("/user/:userId/:name",(req,res)=>{
    console.log(req.params);
    res.send({firstname : "Rakshit", lastname : "Tyagi"})
})

app.listen(3000,()=>{
    console.log("Server started");
});