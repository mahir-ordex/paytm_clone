import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Passbook() {
    const [data, setData] = useState(null);

    // Fetch data from API or local storage
    const fetchPassbookData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/account/transaction-history/67adc51cb57bb8c41bc68802`
            );
            setData(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching passbook data:", error);
        }
    };

    useEffect(() => {
        fetchPassbookData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📜 Transaction History</h2>

                {data === null ? (
                    <p className="text-gray-600 text-center">Loading transaction history...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-blue-600 text-white text-left">
                                    <th className="p-3 border border-gray-300">Transaction ID</th>
                                    <th className="p-3 border border-gray-300">Sender</th>
                                    <th className="p-3 border border-gray-300">Receiver</th>
                                    <th className="p-3 border border-gray-300">Amount</th>
                                    <th className="p-3 border border-gray-300">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.transactions.map((tx, index) => (
                                    <tr key={tx._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition`}>
                                        <td className="p-3 border border-gray-300">{tx._id}</td>
                                        <td className="p-3 border border-gray-300">{tx.senderId}</td>
                                        <td className="p-3 border border-gray-300">{tx.receiverId}</td>
                                        <td className="p-3 border border-gray-300 text-green-600 font-bold">₹ {tx.amount}</td>
                                        <td className="p-3 border border-gray-300">{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Passbook;
