const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat")

const getSecretRoomId = (userId, otherUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, otherUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://devtinder-web-xiqj.onrender.com",
        "https://dev-tinder-web-rho.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    // handle events
    socket.on("joinchat", ({ userId, otherUserId, firstName, profileURL }) => {
      const roomId = getSecretRoomId(userId, otherUserId);
      console.log(firstName + " Joined the Room : " + roomId);
      socket.join(roomId);
    });
    socket.on("sendmessage", async ({ userId, firstName, otherUserId, text, profileURL }) => {
      try{
        const roomId = getSecretRoomId(userId, otherUserId);
        console.log(firstName + " sent " + text);
        // save messages to DB
        let chat = await Chat.findOne({
          participants : {$all : [userId, otherUserId]},
        })
        if(!chat){
          chat = new Chat({
            participants : [userId, otherUserId],
            messages : []
          })
        }
        chat.messages.push({
          senderId : userId,
          text,
        })
        await chat.save();
        io.to(roomId).emit("messageRecieved", { firstName, text, profileURL });
      }catch(err){
        console.error(err);
      }
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
