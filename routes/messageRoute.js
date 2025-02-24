const express = require('express');
const {handleShowAllMessages, handleSendMessage} = require('../controller/message.controller')
const authenticateToken = require('../middleware/authMiddleware')
const route = express.Router();

route.get('/messages/:id',authenticateToken, handleShowAllMessages);
route.post('/send',authenticateToken, handleSendMessage);


module.exports = route;