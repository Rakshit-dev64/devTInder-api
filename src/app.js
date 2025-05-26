const express = require("express");

const app = express();

app.use(
  "/user",(req, res, next) => {
    console.log("1st RH");
    // res.send("1st Response");
    next();
  },
  (req, res, next) => {
    console.log("2nd RH");
    // res.send("2nd Response");
    next();
  },
  (req, res, next)=>{
    console.log("3rd RH");
    // res.send("3rd Response");
    next();
  },
  (req, res, next)=>{
    console.log("4th RH");
    res.send("4th Response");
  }
); 

app.listen(3000, () => {
  console.log("Server started");
});
