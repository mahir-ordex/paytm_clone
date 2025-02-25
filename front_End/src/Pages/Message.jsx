import React, { useEffect, useState, useRef} from "react";
import { Card } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { UserRound, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { getUserData } from "../util/commonFunction";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [receiver, setReceiver] = useState({});
  const [notifyMsg,setNotifyMsg] = useState(false)
  const LogedInUser = getUserData();
  const { userName } = useParams();
  const scrollRef = useRef(null);
  const {newMessages, onlineUser} = useAuth()

  useEffect(()=>{
    console.log("newMessages in socket : ",newMessages);
  },[newMessages])

  async function logInUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get_userdata/${LogedInUser.user
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
  async function receiverData() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get_userdata/${userName}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("User data retrieved : ", res.data.user);
        setReceiver(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    logInUser();
    receiverData();
  }, []);

  const handleGetMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/messages/${receiver._id}`,
        {
          headers: {
            Authorization: `Bearer ${LogedInUser.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    handleGetMessages();
  }, [receiver]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(()=>{
      setNotifyMsg(false)
    },500)
  }, [messages]);

  useEffect(() => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]); 
    console.log("notify message : ",newMessages);
    setNotifyMsg(true)
}, [newMessages]);


  const handleSend = async (e) => {
    // e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send`,
        {
          receiverId: receiver._id,
          text: message,
        },{
        headers: {
          'Authorization': `Bearer ${LogedInUser.token}`
        },
          withCredentials: true }
      );

      console.log("message send part");
        setMessage("");
        handleGetMessages();
    } catch (error) {
      console.log("Fetching Error :", error);
    }
  };

  const handleKeyDown = (e)=>{
    console.log("keyPress : ",e.key);
    if(e.key.trim() ==="Enter"){
      handleSend();
      handleGetMessages();
      setMessage('')
    }
  }

  return (
    <div className="h-screen bg-gray-50">
    <Card className="h-full rounded-none shadow-lg">
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={receiver.profilePicture} />
              <AvatarFallback>
                <UserRound className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {receiver.firstName} {receiver.lastName}
              </h3>
              {onlineUser.includes(receiver._id) ? 
              (<p className="text-sm text-green-500">Online</p>) 
              :
              (<p className="text-sm text-amber-500">Ofline</p>) 
              }
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Video className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
          {messages && messages?.length > 0 ? (
            <div className="space-y-6">
              {messages?.map((msg) => (
                <div
                  key={msg?._id}
                  className={`flex ${
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`flex items-start gap-2 ${
                        msg.senderId === user._id ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            msg.senderId === user._id
                              ? user.profilePicture
                              : receiver.profilePicture
                          }
                        />
                        <AvatarFallback>
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.senderId === user._id
                              ? "bg-blue-500 text-white"
                              : "bg-white shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Message attachment"
                              className="rounded-lg mt-2 max-h-48 object-cover w-full"
                            />
                          )}
                          {msg.amount && (
                            <div className="mt-2 p-2 rounded-lg bg-opacity-20 text-white bg-gray-500">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Amount</span>
                                <span className="font-semibold">
                                  ₹ {msg.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs text-gray-400 ${
                            msg.senderId === user._id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="p-6 rounded-full bg-gray-100">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm">
                Send your first message to start the conversation
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="max-w-5xl mx-auto flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-gray-100"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-gray-200"
            />
            <Button 
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Messages Indicator */}
        {notifyMsg && newMessages && newMessages.length > 0 && (
          <div className="fixed bottom-20 right-4">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              {newMessages.length} new {newMessages.length === 1 ? 'message' : 'messages'}
            </div>
          </div>
        )}
      </div>
    </Card>
  </div>
);
}


export default Message;
