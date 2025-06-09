const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 15
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
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Invalid Email address");
        //     }
        // }
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
        //moved to validation file
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error("Gender data is not Valid");
        //     }
        // }
    },
    profileURL : {
        type : String,
        default : "https://i.pinimg.com/236x/a3/09/ed/a309ed3530e0f365781d8c2607ac4e7e.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL");
            }
        }
    },
    about : {
        type : String,
        default : "Responsible Citizen of The Suplex City"
    },
    skills : {
        type : [String]
    }   
},
{
    timestamps : true
}) 

// const User = mongoose.model("User", userSchema);
// module.exports = User;
// OR
module.exports = mongoose.model("User", userSchema);