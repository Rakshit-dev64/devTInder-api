const express = require("express");
const {userAuth} = require("../middlewares/authorization");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
 
requestRouter.post("/request/send/:status/:userId", userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        // check - 1 if the status sent in params is allowed or not
        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status type :" + status }) // return will not let the code move ahead
        }
        // check - 2 if the user to whom request sent(toUser) is present in our DB or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message : "User not found"});
        }
        // check - 3 disable user to send connection request to himself (can do it here and can do it in schema itself using pre function)
        if(fromUserId.equals(toUserId)){
            return res.status(400).json({message : "Can not send connection request to yourself"});
        }

        // check - 4 if the connection request already exists in our db
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [ // This is a common pattern for matching relationships between two users, regardless of direction.
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest){
            res.status(400).json({message : "Request already exists"});
        }

        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status})
        const data = await connectionRequest.save();

        res.json({
            message : "from : " + req.user.firstName + ", to : " + toUser.firstName + ", status : " + status,
            data
        });
 
    }catch(err){
        res.status(400).send(err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const user = req.user;
        const {status, requestId} = req.params;
        // check - 1 if status is valid or not
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid Status Type"});
        }
        //check - 2 status is interested and loggedInUserId = toUserId
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : user._id,
            status : "interested"
        })
        if(!connectionRequest){
            return res.status(400).json({message : "No connection request found"});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message : "Connection Request " + status})
    }catch(err){
        res.status(400).json({message : err.message});
    }
})

module.exports = requestRouter;
