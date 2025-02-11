const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
