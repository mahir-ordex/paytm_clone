const User = require('../model/userModel');
const Transaction = require('../model/transactionModel');

const handleShowAllUsers = async (req, res) => {
    try {
        console.log("req.params.id:", req.params.id);

        const loggedInUserId = req.params.id; // Get logged-in user ID

        const users = await User.find().select('-password');

        // Fetch users with transactions
        const usersWithTransactions = await Promise.all(
            users.map(async (user) => {
                if (user._id.toString() === loggedInUserId) {
                    return { ...user._doc, lastTransaction: null }; // Exclude self transactions
                }

                const lastTransaction = await Transaction.findOne({
                    $or: [
                        { senderId: loggedInUserId, receiverId: user._id },
                        { senderId: user._id, receiverId: loggedInUserId }
                    ]
                })
                .sort({ createdAt: -1 }) // Get the latest transaction
                .limit(1);

                return {
                    ...user._doc, 
                    lastTransaction: lastTransaction || null, 
                };
            })
        );

        // Filter out the logged-in user
        const finalListOfUsers = usersWithTransactions.filter(user => user._id.toString() !== loggedInUserId);

        res.status(200).json({ users: finalListOfUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { handleShowAllUsers };
