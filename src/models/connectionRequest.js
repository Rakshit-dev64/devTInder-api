const mongoose = require("mongoose");
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : User // referencing to User Collection
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : User
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["accepted", "rejected", "interested", "ignored"],
            message : `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps : true
})

connectionRequestSchema.index({fromUserId : 1, toUserId : 1}); // indexing 

// connectionRequestSchema.pre("save", function(){
//    if(this.fromUserId.equals(this.toUserId)){
//     throw new Error("Can not send connection request to yourself");
//    }
//    next();
// })

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;