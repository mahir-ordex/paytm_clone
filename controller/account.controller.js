const mongoose = require("mongoose");
const Transaction = require("../model/transactionModel"); 
const Account = require("../model/accountModel"); 

const transaction = async (req, res) => {
    const { senderId, receiverId, amount } = req.body;
    // console.log("Transaction Request:", senderId, receiverId, amount);

    const session = await mongoose.startSession();

    if (!senderId || !receiverId || !amount) {
        return res.status(400).json({ message: "Please provide all fields", success: false });
    }

    try {
        session.startTransaction();

        // Convert to ObjectId
        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
         
        if(senderObjectId === receiverObjectId) {
            return res.status(400).json({ message: "Sender and receiver cannot be the same", success: false });
        }

        const sender = await Account.findOne({ userId: senderObjectId });
        const receiver = await Account.findOne({ userId: receiverObjectId });

        if (!sender) 
            return res.status(404).json({ message: "Sender User not found", success: false });
        if (!receiver) 
            return res.status(404).json({ message: "Receiver User not found", success: false });
        if (sender.balance < amount) 
            return res.status(400).json({ message: "Insufficient balance", success: false });

        await Account.updateOne(
            { userId: senderObjectId },
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.updateOne(
            { userId: receiverObjectId },
            { $inc: { balance: amount } },
            { session }
        );

        const newTransaction = await Transaction.create(
            [{
                senderId: senderObjectId,
                receiverId: receiverObjectId,
                amount,
                timestamp: new Date(),
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        // console.log("Transaction Successful");
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
        const id= req.params.id;
        if(!id) return res.status(400).send('Please provide user id')

        const allTransaction =await Transaction.find({$or:[{senderId:id},{receiverId:id}]}).populate("senderId","-password").populate("receiverId","-password").sort({"timestamp":-1})
        res.status(200).json({message:'Transaction History', transactions:allTransaction})
    }catch(err){
        console.error('Transaction History Failed:', err.message);
        res.status(500).send(`Something Went Wrong`);
    }
}


const userBalance = async(req,res) =>{
    try{
        const id= req.params.id;
        if(!id) return res.status(400).send('Please provide user id')
            
        const user = await Account.findOne({userId:id}).select('balance')
        res.status(200).json({message:'User Balance', balance:user.balance})
        
    }catch(err){
        console.error('User Balance Failed:', err.message);
        res.status(500).send(`Something Went Wrong`);
    }
}

module.exports = {transaction,transactionHistory,userBalance};