import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {getUserData} from '../util/commanFunction'

function DeskBoard() {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");

    const handleShowData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/daskboard/show-all-users/67ac5d26406693f3eca86f11`,
                { withCredentials: true }
            );
            setData(res.data);
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    useEffect(() => {
        handleShowData();
    }, []);

    const openSendMoneyModal = (user) => {
        setSelectedUser(user);
        console.log("modul",user)
        setShowModal(true);
    };

    const closeSendMoneyModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setAmount("");
    };

    const handleSendMoney = async() => {
       try {
         if (!amount || isNaN(amount) || amount <= 0) {
             alert("Please enter a valid amount.");
             return;
         }
         const sender= getUserData()
         const res = await axios.post(
             `${import.meta.env.VITE_BACKEND_URL}/account/transaction`,
             { senderId: sender._id, receiverId: selectedUser._id, amount:Number(amount) },
             { withCredentials: true }
         );
         console.log(`Sending ${amount} to ${selectedUser?.firstName} ${selectedUser?.lastName}`);
         if(res.status === 200 && res.data.success){
             alert("Money sent successfully.");
             handleShowData(); // refresh data after sending money
             console.log("Notification sent to:", selectedUser.firstName);
             closeSendMoneyModal();
         }         
         
       } catch (error) {
         console.error("Error sending money:", error);
         alert("An error occurred while sending money.");
        
       }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-center mb-6">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.users && data.users.map((user, index) => (
                    <div key={index} className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
                        <img src={user?.profilePicture} alt="profile" className="w-16 h-16 rounded-full mb-2" />
                        <h3 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h3>
                        {user?.lastTransaction ? (
                            <p className="text-sm text-gray-600">Last Transaction: ₹{user.lastTransaction.amount}</p>
                        ) : (
                            <p className="text-sm text-gray-600">No recent transactions</p>
                        )}
                        <button onClick={() => openSendMoneyModal(user)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            Send Money
                        </button>
                    </div>
                ))}
            </div>

            {/* Send Money Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 h-72 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-semibold mb-8">Send Money to {selectedUser.firstName} {selectedUser.lastName}</h2>
                        <input 
                            type="number" 
                            placeholder="Enter amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-between mt-12">
                            <button onClick={closeSendMoneyModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                            <button onClick={handleSendMoney} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeskBoard;
