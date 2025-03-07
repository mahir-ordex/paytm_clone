import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";
import { UserRound, LogOut, Send, Wallet, ArrowUpDown } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { getUserData } from "../util/commonFunction";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

const DashBoard = () => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); //For Search Bar
  const [notifyMsg, setNotifyMsg] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { logout, onlineUser, newMessages } = useAuth();
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const LogedInUser = getUserData();

  // Add function to filter users based on search
  const filteredUsers = data?.users?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    setNotifyMsg(true);
    console.log("Messages :", newMessages);
  }, [newMessages]);

  async function logInUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get_userdata/${
          LogedInUser.user
        }`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const SendMoneyDialog = ({
    open,
    onOpenChange,
    selectedUser,
    onSendMoney,
    amount,
    setAmount,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
      setError("");
      if (!amount || isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount");
        return;
      }
      setIsLoading(true);
      try {
        await onSendMoney();
        setIsLoading(false);
      } catch (error) {
        setError("Failed to send money. Please try again.");
        setIsLoading(false);
      }
    };

    const quickAmounts = [100, 500, 1000, 2000, 5000];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Money
            </DialogTitle>
            <DialogDescription>
              Send money securely and instantly
            </DialogDescription>
          </DialogHeader>

          {/* Recipient Card */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={selectedUser?.profilePicture}
                  alt={selectedUser?.firstName}
                />
                <AvatarFallback>
                  <UserRound className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </h4>
                <p className="text-sm text-gray-500">Recipient</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4 py-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  className="pl-7"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAmount(quickAmount.toString());
                      setError("");
                    }}
                    className="text-sm"
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/signout`,
        { withCredentials: true } // Move here!
      );
      if (res.status === 200) {
        logout();
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "LogOut failed. Please try again."
      );
    }
  };

  const [totalTransaction, setTotalTransaction] = useState(null);

  // Fetch data from API or local storage
  const fetchPassbookData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/account/transaction-history/${
          LogedInUser.user
        }`,
        {
          headers: {
            Authorization: `Bearer ${LogedInUser.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 403) {
        navigate("/login");
      }
      setTotalTransaction(res.data.transactions);
    } catch (error) {
      console.error("Error fetching passbook data:", error);
    }
  };

  const handleNavigateMessagePage = (id) => {
    setNotifyMsg(false);
    setTimeout(() => navigate(`/message/${id}`), 100);
  };

  useEffect(() => {
    if (!LogedInUser?.token) {
      navigate("/login");
      return;
    }
    handleShowAllData();
    fetchPassbookData();
    logInUser();
  }, []);

  const handleShowAllData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/daskboard/show-all-users/${
          LogedInUser.user
        }`,
        {
          headers: {
            Authorization: `Bearer ${LogedInUser.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 403) {
        navigate("/login");
      }
      setData(res.data);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const handleSendMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/account/transaction`,
        {
          senderId: LogedInUser.user,
          receiverId: selectedUser._id,
          amount: Number(amount),
        },
        {
          headers: { Authorization: `Bearer ${LogedInUser.token}` },
          withCredentials: true,
        }
      );

      if (res.status === 403) {
        navigate("/login");
      }

      if (res.status === 200 && res.data.success) {
        alert("Money sent successfully!");

        await Promise.all([handleShowAllData(), fetchPassbookData()]); // Ensure both updates finish
        setShowModal(false);
        setAmount("");
      }
    } catch (error) {
      console.error("Error sending money:", error);
      alert("An error occurred while sending money.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm shadow-blue-100">
        {/* Logo  */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Wallet className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">PaymentHub</h1>
            </div>
            {/* Search Bar Code */}
            <div className="mt-4 bg-transparent w-xl">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 w-full"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </div>

            {LogedInUser && (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex ">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} alt="profile" />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium pt-1.5">{user.userName}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Recent Activity
            </CardTitle>
            {/* <CardDescription>Your latest transactions and transfers</CardDescription> */}
          </CardHeader>
          <CardContent>
            <Link to="/payment">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <ArrowUpDown className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Total Transactions</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <p className="text-2xl font-semibold">
                  ₹{" "}
                  {totalTransaction && totalTransaction.length > 0
                    ? totalTransaction.reduce(
                        (acc, curr) => acc + curr.amount,
                        0
                      )
                    : 0}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.users?.map((user, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.firstName}
                      />
                      <AvatarFallback>
                        <UserRound className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold mb-2">
                      {user.firstName} {user.lastName}
                    </h3>

                    {onlineUser.includes(user._id) && (
                      <span className="bg-gray-300 border-black px-1">
                        online
                      </span>
                    )}
                    {user.lastTransaction ? (
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Last Transaction:</p>
                        <p className="font-medium">
                          ₹ {user.lastTransaction.amount}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-4">
                        No recent transactions
                      </p>
                    )}
                    <div className="flex">
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Money
                      </Button>
                      <div className="flex">
                        <Button
                          className="w-full bg-blue-500 "
                          onClick={() => handleNavigateMessagePage(user._id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>

                        {notifyMsg && newMessages.length > 0 && (
                          <div
                            onClick={() => handleNavigateMessagePage(user._id)}
                            className="relative cursor-pointer group"
                          >
                            <AlertCircle className="w-6 h-6 text-blue-500 transition-transform group-hover:scale-110" />

                            {/* Store filtered messages count in a variable to avoid redundant filtering */}
                            {(() => {
                              const unreadCount = newMessages.filter(
                                (newMsg) => newMsg.senderId === user._id
                              ).length;
                              return unreadCount > 0 ? (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                  {unreadCount}
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Send Money Dialog */}
      <SendMoneyDialog
        open={showModal}
        onOpenChange={setShowModal}
        selectedUser={selectedUser}
        onSendMoney={handleSendMoney}
        amount={amount}
        setAmount={setAmount}
      />
    </div>
  );
};

export default DashBoard;
