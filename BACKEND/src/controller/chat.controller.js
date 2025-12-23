const chatModel = require('../models/chat.model');

async function createChat(req, res) {
    const { title } = req.body;
    const user = req.user;

    const newChat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: 'Chat created successfully',
        chat: {
            _id: newChat._id,
            title: newChat.title,
            lastActivity: newChat.lastActivity,
            user: newChat.user
        }
    })
}

module.exports = { createChat };