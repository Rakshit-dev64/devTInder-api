const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const http = require("http");

// CORS configuration for incognito mode compatibility
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://devtinder-web-xiqj.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "Cookie",
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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

