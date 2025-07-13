const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const http = require("http");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : ["http://localhost:5173","http://localhost:5174"],
    credentials : true
}
));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userR"); 
const chatRouter = require("./routes/chat"); 
const initializeSocket = require("./utils/socket");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter)

const server = http.createServer(app);
initializeSocket(server);

connectDB().then(()=>{
    console.log("Connected to Database");
    // app.listen usually but had to change because using sockets.io
    server.listen(PORT,()=>{
        console.log("Server Started");
    })
}).catch(err=>{
    console.log("Something went wrong",err)
});

