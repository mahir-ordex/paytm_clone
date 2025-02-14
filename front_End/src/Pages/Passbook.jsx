import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserData } from '../util/commanFunction';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { BadgeDollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);

function Passbook() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const loggedInUserId = getUserData();
//   console.log("loggedInUserId", loggedInUserId);

  const handleGetAccountBalance = async() => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/account/balance/${loggedInUserId.user}`,{
            headers: {
              'Authorization': `Bearer ${loggedInUserId.token}`
            },
            withCredentials: true
        }
      );
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error fetching account balance:", error);
      throw new Error('Failed to fetch account balance. Please try again later.');
    }
  };

  const fetchPassbookData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/account/transaction-history/${loggedInUserId.user}`,
        {
            headers: {
              'Authorization': `Bearer ${loggedInUserId.token}`
            },
            withCredentials: true
        }
      );
      setData(res.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch transaction history. Please try again later.');
      console.error("Error fetching passbook data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassbookData();
    handleGetAccountBalance()
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <Card className="max-w-6xl mx-auto mb-4">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <BadgeDollarSign className="h-8 w-8 text-blue-600" />
                  Account Balance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-lg font-semibold text-gray-800">
                {formatAmount(balance)}
              </p>
            </CardContent>
          </Card>
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BadgeDollarSign className="h-8 w-8 text-blue-600" />
              Transaction History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Sender</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Receiver</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.transactions.map((tx) => {
                    const isSender = tx?.senderId._id === loggedInUserId.user;
                    return (
                      <tr key={tx._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-600">{tx._id}</td>
                        <td className="p-4 text-sm font-medium">{tx?.senderId.userName}</td>
                        <td className="p-4 text-sm font-medium">{tx?.receiverId.userName}</td>
                        <td className="p-4">
                          <div className={`flex items-center gap-1 font-medium ${isSender ? 'text-red-500' : 'text-green-500'}`}>
                            {isSender ? (
                                <ArrowDownRight className="h-4 w-4" />
                            ) : (
                                <ArrowUpRight className="h-4 w-4" />
                            )}
                            {isSender ? '- ' : '+ '}
                            {formatAmount(tx.amount)}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{formatDate(tx.timestamp)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Passbook;