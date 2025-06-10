const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodedMessage = await jwt.verify(token, "SecretKey@998");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user; // attaching the user we found in the db to req so that  it can be accessed in later middleware or route handlers.
        next();
    }catch(err){
        res.status(400).send(err.message);

    }

}

module.exports = {
    userAuth,
}