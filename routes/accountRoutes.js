const express = require('express');
const {transaction,transactionHistory,userBalance} = require('../controller/account.controller');
const authenticateToken = require('../middleware/authMiddleware')
const route = express.Router();

route.post('/transaction',authenticateToken, transaction);
route.get('/transaction-history/:id',authenticateToken, transactionHistory);
route.get('/balance/:id',authenticateToken,userBalance);

module.exports = route;