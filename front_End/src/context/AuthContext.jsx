import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [newMessages,setNewMessages] =useState([]);
    const [selectedUser,setSelectedUser] =useState(null);

    // On refresh, restore data from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        try {
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Error parsing saved user:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login and Logout functions
    const login = (data, token) => {
        setUser(data);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        disconnectSocket();
    };

    // WebSocket connection management
    const connectSocket = () => {
        console.log("Connectind socket ,",user);
        if (!user) {
            console.error("User ID is missing, cannot connect to WebSocket");
            return;
        }
    
        const newSocket = io(import.meta.env.BASE_URL, {
            query: { userId: user},
            transports: ["websocket"],
        });
    
        newSocket.on("connect", () => {
            console.log("Connected to WebSocket", newSocket.id);
        });
    
        newSocket.on("getOnlineUsers", (users) => {
            setOnlineUser(users);
        });
    
        setSocket(newSocket);
    };
    

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        if (!socket) return;
    
        const handleNewMessage = (newMsg) => {
            const isMessageSentFromSelectedUser = newMsg.senderId === selectedUser._id;
           if (!isMessageSentFromSelectedUser) return;

            setNewMessages((prevMessages) => [...prevMessages, newMsg]);
        };
    
        socket.on("newMessage", handleNewMessage);
    
        return () => {
            socket.off("newMessage", handleNewMessage); // Cleanup listener on unmount
        };
    }, [socket]);
    
        

    // Automatically manage socket connection when user changes
    useEffect(() => {
        if (user) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, socket, onlineUser,newMessages,setSelectedUser,selectedUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
