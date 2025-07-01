const express = require("express");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authRouter = express.Router();

//add user
authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data coming from request
    validateSignupData(req);

    // encrypt the password to hashcode
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      about,
      profileURL,
      age,
      gender,
    } = req.body; // extracting these field from req because writing req.body.firstName is a pain in the neck
    const passwordHash = await bcrypt.hash(password, 10); // 10 is number of salt, it can be considered as the number of times the encyption procees is performed on the password

    //creating a new instance of User model (User model is the blueprint for the instancees)
    // const user = new User(req.body); //bday way because never trust req.body
    const user = new User({
      firstName,
      lastName,
      emailId,
      about,
      skills,
      profileURL,
      gender,
      age,
      password: passwordHash,
    });
    const signedUser = await user.save();
    const token = await jwt.sign({ _id: signedUser._id }, "SecretKey@998", {
      expiresIn: "7d",
    });
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    res.json({message : "User added successfully", data : signedUser});
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
  }
});

// login api
authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create a jwt token
      const token = await jwt.sign({ _id: user._id }, "SecretKey@998", {
        expiresIn: "7d",
      });
      // add the token to cookie and send response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// logout api
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User Logged Out");
});

module.exports = authRouter;
