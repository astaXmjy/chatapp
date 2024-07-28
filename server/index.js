const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const httpServer = require('http');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
require('dotenv').config();
const connectDB = require('./config/db');
const { Server } = require("socket.io");

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

const port = process.env.PORT;

app.listen(port, ( req, res ) => {
    connectDB();
    const io = new Server(httpServer, {
        path: "/socket",
        wsEngine: ["ws", "wss"],
        transports: ["websocket", "polling"],
        cors: {
          origin: "*",
        },
        allowEIO3: true,
    });
})
