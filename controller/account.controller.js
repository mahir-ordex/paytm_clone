const { default: mongoose } = require('mongoose');
const Account = require('../model/accountModel')
const Transaction = require('../model/transactionModel')

const transaction = async (req, res) => {
    const section = await mongoose.startSession()
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) return res.status(400).send('Please provide all fields')
    try {

        section.startTransaction();
        const sender = await Account.findOne({ userId: senderId })
        const receiver = await Account.findOne({ userId: receiverId })
        if (!sender || !receiver) return res.status(404).send('User not found')
        if (sender.balance < amount) return res.status(400).send('Insufficient balance')

        await Account.updateOne(
            { userId: senderId },
            { $inc: { balance: -amount } },
            { session }
        );
        await Account.updateOne(
            {userId: receiverId},
            {$inc: { amount: amount } },
            { session }
        )
        const newTransaction = await Transaction.create(
            [
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: amount,
                    timestamp: new Date(),
                }
            ],
            { session }
        );
        await section.commitTransaction();
        session.endSession();

        console.log('Transaction Successful');
        res.status(200).json({ message: 'Transaction Successful', transaction: newTransaction[0] });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Transaction Failed:', error.message);
        res.status(500).send(`Transaction Failed: ${error.message}`);
    }
}

const transactionHistory = async(req,res) =>{
    try{
        const {id }= req.body;
        if(!id) return res.status(400).send('Please provide user id')

        const allTransaction =await Transaction.find({$or:[{sender:id},{receiver:id}]})
        res.status(200).json({message:'Transaction History', transactions:allTransaction})
    }catch(err){
        console.error('Transaction History Failed:', err.message);
        res.status(500).send(`Something Went Wrong`);
    }
}

module.exports = {transaction,transactionHistory};