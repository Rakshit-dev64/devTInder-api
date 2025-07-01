const express = require("express");
const { userAuth } = require("../middlewares/authorization");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
 const USER_SAFE_DATA =
      "firstName lastName profileURL age gender about skills";

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // helps me getting these fields from User collection as i referenced fromUserId with User
    if (!connectionRequest) {
      return res.status(400).json({ message: "No requests found" });
    }
    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectedUser = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (!connectedUser) {
      return res.status(400).json({ message: "No Connections" });
    }
    const data = connectedUser.map((req) => {
      if (req.fromUserId._id.equals(user._id)) {
        return req.toUserId;
      }
      return req.fromUserId;
    }); // to get only fromUser data nothing else
    res.json({
      message: "Fetched all the connections",
      data,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    /* user should not encounter these requests/profiles
        1. his own profile
        2. his connections
        3. ignored profiles
        4. already sent the connection request
        */
    const user = req.user;
    const page = parseInt(req.query.page) || 1; // for pagination i.e. sending a limited no. of users at a time not the whole data
    var limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    // finding the requests where i am involved whether i am the sender, reciever or even my connections  
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(user._id.toString()); // the logged in user should not see himself in the feed
    connectionRequest.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString()); // hides both the sender and reciever from the feed because in some req user is sender and in some user is reciever so i cant hide one, i have to hide both
        hideUsersFromFeed.add(req.toUserId.toString());
    })

    const users = await User.find({
    _id : { $nin : Array.from(hideUsersFromFeed)} // had to convert the set of ids to array becuase $nin only expects arrays
    }).select("firstName lastName about profileURL gender age skills").skip(skip).limit(limit);
  
    res.send(users);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// userRouter.get("/user/feed", userAuth, async(req,res)=>{
//     const user = req.user;
//     const connectionRequest = await ConnectionRequest.find({
//         $or : [
//             {fromUserId : user._id}, {toUserId : user._id}
//         ]
//     })
//     const hideUsersFromFeed = new Set();
//     hideUsersFromFeed.add(user._id.toString());
//     connectionRequest.forEach((req)=>{
//         hideUsersFromFeed.add(req.fromUserId.toString())
//         hideUsersFromFeed.add(req.toUserId.toString())
//     })
//     res.send(connectionRequest);
// })


module.exports = userRouter;
