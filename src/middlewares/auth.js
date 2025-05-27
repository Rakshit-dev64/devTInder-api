const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized){
        console.log("User Authorized");
        next();
    }
    else{
        res.status(401).send("Unauthorized Access");
    }
}
const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized){
        console.log("User Authorized");
        next();
    }
    else{
        res.status(401).send("Unauthorized Access");
    }
}

module.exports = {
    adminAuth,
    userAuth
}