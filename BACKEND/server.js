require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const initSocketServer = require('./src/service/socket.service');
const httpServer = require('http').createServer(app);

connectDB();
initSocketServer(httpServer);


httpServer.listen(3000, () => {
    console.log('Server is running on 3000');
})