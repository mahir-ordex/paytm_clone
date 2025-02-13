const express = require('express');
const {handleShowAllUsers} = require('../controller/daskBoard.controller');
const authenticateToken = require('../middleware/authMiddleware')
const router = express.Router();



router.get('/show-all-users/:id',authenticateToken, handleShowAllUsers);

module.exports = router;


