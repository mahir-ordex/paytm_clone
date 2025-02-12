const {handleShowAllUsers} = require('../controller/daskBoard.controller')
const express = require('express');
const {authenticateToken} = require('../middleware/authMiddleware')
const route = express.Router();


route.get('/show-all-users/:id', handleShowAllUsers);

module.exports = route;


