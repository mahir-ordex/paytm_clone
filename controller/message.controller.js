const Message = require('../model/messageModel');
const User = require('../model/userModel');
const Transaction = require("../model/transactionModel");
const cloudinary = require('../Utils/cloudnarry') 
const {io, getReceiverSocketId} = require("../Utils/socket")

const handleShowAllMessages = async (req, res) => {
    try {
        const senderId= req.params.id;
        const loggedInUserId = req.user.userId;
        // console.log("Requested sender Data: " + senderId + "/n logged in userId: " + loggedInUserId);


        if (!senderId || !loggedInUserId) {
            return res.status(400).json({ error: "Invalid request parameters" });
        }

        // Fetch messages
        const messages = await Message.find({
            $or: [
                { senderId, receiverId: loggedInUserId },
                { senderId: loggedInUserId, receiverId: senderId }
            ]
        }).sort({ createdAt: -1 });

        // Fetch transactions
        const transactions = await Transaction.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: -1 });

        const combineAll = [...transactions, ...messages].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json({messages: combineAll });

    } catch (error) {
        console.error('Show All Messages Failed:', error.message);
        res.status(500).send(`Something Went Wrong`);
    
    }
}

const handleSendMessage = async (req, res) => {
    try {
        const { receiverId, ...message } = req.body;
        const senderId = req.user.userId;

        if (!receiverId || (!message.text && !message.image)) {
            return res.status(400).json({ msg: "Invalid Parameter" });
        }

        const receiverData = await User.findById(receiverId);
        if (!receiverData) {
            return res.status(404).json({ msg: "Receiver Not Found!" });
        }

        if (message.image) {
            const result = await cloudinary.uploader.upload(message.image, { folder: "messages" });
            message.image = result.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            ...message,
            timestamp: new Date(),
        });
        await newMessage.save();

        console.log("Receiver ID:", receiverId);
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("Receiver Socket ID:", {receiverSocketId});

        if (receiverSocketId) { 
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({ success: true, newMessage });
    } catch (error) {
        console.error("Send Message Failed:", error.message);
        res.status(500).json({ msg: "Something Went Wrong" });
    }
};

module.exports = { handleShowAllMessages, handleSendMessage};
