import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // User is an ID, not an object
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUserId = localStorage.getItem("user");

        if (savedToken && savedUserId) {
            setToken(savedToken);
            setUser(savedUserId); // Directly setting the user ID
        }

        setLoading(false);
    }, []);

    const login = (userId, token) => {
        setUser(userId);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", userId);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        disconnectSocket();
    };

    const connectSocket = () => {
        if (!user) {
            console.error("User ID is missing, cannot connect to WebSocket");
            return;
        }

        console.log("Connecting socket for user:", user);

        const newSocket = io("https://bankingxchatting.onrender.com", {
            query: { userId: user }, // Directly passing user as ID
            transports: ["websocket", "polling"],
            withCredentials: true
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected to WebSocket", newSocket.id);
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
            console.log("🛑 Disconnected from WebSocket");
        }
    };

    useEffect(() => {
        if (user) {
            connectSocket();
        } else {
            disconnectSocket();
        }

        return () => disconnectSocket();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMsg) => {
            const isMessageSentFromSelectedUser = newMsg.senderId === selectedUser;
            if (!isMessageSentFromSelectedUser) return;
            setNewMessages((prevMessages) => [...prevMessages, newMsg]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser]);

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, socket, onlineUser, newMessages, setSelectedUser, selectedUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
