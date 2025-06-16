const express = require("express");
const { userAuth } = require("../middlewares/authorization");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
 const USER_SAFE_DATA =
      "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
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
    const data = connectedUser.map((row) => {
      if (row.fromUserId._id.equals(user._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
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
    // requests that are already my connection
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(user._id.toString());
    connectionRequest.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    })

    const users = await User.find({
    _id : { $nin : Array.from(hideUsersFromFeed)}
    }).select("firstName about");
  
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
