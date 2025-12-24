const { Server } = require("socket.io");
const cookie = require("cookie"); // why using 'cookie' package instead of 'cookie-parser' here? -> because 'cookie-parser' is an express middleware and cannot be used directly in socket.io
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const aiService = require("./ai.service");
function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    /* options */
  });
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log("Socket connection cookies:", cookies);

    if (!cookies.token) {
      next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user);

    console.log("New socket connection:", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      console.log(messagePayload);

      const response = await aiService.generateResponse(messagePayload.content);

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
