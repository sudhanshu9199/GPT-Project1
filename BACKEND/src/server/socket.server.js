const { Server } = require("socket.io");

function initSocketServer(httpServer) {

    const io = new Server(httpServer, { /* options */ });
    io.on("connection", (socket) => {
      console.log('New socket connection:', socket.io);
      
    });
}


module.exports = initSocketServer;