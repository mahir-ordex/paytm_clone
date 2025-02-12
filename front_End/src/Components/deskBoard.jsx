import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeskBoard() {
    const [data, setData] = useState(null);

    const handleShowData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/daskboard/show-all-users/67ab025c20bc09a442f1d930`,
                { withCredentials: true }
            );

            console.log("Response Data:", res.data);
            setData(res.data); // Store response in state

        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    useEffect(() => {
        handleShowData();
    }, []);

    return (
        <div>
            {data?.users && data.users.map((user, index) => (
                <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                    <img src={user?.profilePicture} alt={`${user?.firstName} profile`} width="50" height="50" />
                    <h3>{user?.firstName} {user?.lastName}</h3>
                    {user?.lastTransaction ? (
                        <h6>Last Transaction: {user.lastTransaction.amount} (ID: {user.lastTransaction._id})</h6>
                    ) : (
                        <h6>No recent transactions</h6>
                    )}
                </div>
            ))}
        </div>
    );
}

export default DeskBoard;
