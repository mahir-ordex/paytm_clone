const express = require('express');
const cors = require('cors');
const {app,io,server} = require("./Utils/socket")
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/userRoutes');
const accountRoute = require('./routes/accountRoutes');
const deskBoardRoute = require('./routes/deskBoardRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const messageRoute = require('./routes/messageRoute')
var cookieParser = require('cookie-parser')



app.use(cors({
    origin: "https://paytm-clone-green.vercel.app", // Your Vercel frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));
app.use('/api/users', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/daskboard', deskBoardRoute);
app.use('/api',messageRoute)

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("❌ MongoDB URI is missing. Check your .env file.");
    process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 100000, 
})
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
