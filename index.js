const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/userRoutes');
const accountRoute = require('./routes/accountRoutes');
const daskBoardRoute = require('./routes/daskBoardRoute');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/api/users', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/daskboard', daskBoardRoute);

mongoose.connect('mongodb://127.0.0.1:27017/paytm')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
