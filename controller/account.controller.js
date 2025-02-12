const mongoose = require("mongoose");
const Transaction = require("../model/transactionModel"); 
const Account = require("../model/accountModel"); 

const transaction = async (req, res) => {
    const session = await mongoose.startSession();
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) {
        return res.status(400).json({ message: "Please provide all fields", success: false });
    }

    try {
        session.startTransaction();
        // const senderId = new mongoose.Types.ObjectId(senderId);
        // const receiverId = new mongoose.Types.ObjectId(receiverId);

        const sender = await Account.findOne({ userId: senderId });
        const receiver = await Account.findOne({ userId: receiverId });

        if (!sender || !receiver) return res.status(404).json({ message: "User not found", success: false });
        if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance", success: false });

        await Account.updateOne(
            { userId: senderId },
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.updateOne(
            { userId: receiverId },
            { $inc: { balance: amount } },
            { session }
        );

        const newTransaction = await Transaction.create(
            [
                {
                    senderId: senderId,
                    receiverId: receiverId,
                    amount: amount,
                    timestamp: new Date(),
                }
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        console.log("Transaction Successful");
        return res.status(200).json({
            message: "Transaction Successful",
            transaction: newTransaction[0],
            success: true,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Transaction Failed:", error.message);
        return res.status(500).json({ message: `Transaction Failed: ${error.message}`, success: false });
    }
};



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