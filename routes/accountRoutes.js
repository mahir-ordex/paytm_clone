const express = require('express');
const {transaction,transactionHistory} = require('../controller/account.controller');
const authenticateToken = require('../middleware/authMiddleware')
const route = express.Router();

route.post('/transaction', authenticateToken, transaction);

route.get('/transaction-history', authenticateToken, transactionHistory);

module.exports = route;