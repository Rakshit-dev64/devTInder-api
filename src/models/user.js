const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 15,
        // index: true // for enabling indexing on this field
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    age : {
        type : Number,
        min : 16
    },
    gender : {
        type : String,
        lowercase : true,
        enum : {
            values : ["male", "female", "others"],
            message : `{VALUE} is not a valid gender type`, 
        }
    },
    profileURL : {
        type : String,
        default : "https://cdn.getmerlin.in/cms/pfp3_d7855f9562.webp",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL");
            }
        }
    },
    about : {
        type : String,
        default : "Responsible Citizen of The Suplex City",
        maxLength : 250
    },
    skills : {
        type : [String]
    }   
},
{
    timestamps : true
}) 
// indexing
// userSchema.index({firstName : 1});
// userSchema.index({gender : 1})

// const User = mongoose.model("User", userSchema);
// module.exports = User;
// OR
module.exports = mongoose.model("User", userSchema);