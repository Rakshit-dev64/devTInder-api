const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth")

const app = express();

app.use("/user",(req, res, next)=>{
    //best practice is to always use try catch
    // try{
        throw new Error("error");
        res.send("User Logged In");
    // }
    // catch(err){
        // res.send("Soemthing went wrong");
    // }
    
})

app.use("/",(err, req, res, next)=>{
    if(err){
        res.status(500).send("Something went wrong");
    }  
})
app.listen(3000, () => {
  console.log("Server started");
});
