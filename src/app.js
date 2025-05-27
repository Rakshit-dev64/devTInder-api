const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth")

const app = express();

app.use("/admin", adminAuth);

app.get("/user",userAuth,(req,res)=>{
    res.send("User Looged in");
})

app.get("/admin/getAllData",(req,res,next)=>{
        res.send("All Data Sent");
    }
)
app.get("/admin/deleteUser",(req,res,next)=>{
        res.send("Deleted User");
    }
)


app.listen(3000, () => {
  console.log("Server started");
});
