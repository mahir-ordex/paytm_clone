const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/userRoutes');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoute);
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect('mongodb://127.0.0.1:27017/paytm')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
