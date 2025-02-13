const JWT = require('jsonwebtoken');

const authenticateToken = (req, res, next) => { 
    console.log("Inside authenticateToken middleware");
    console.log("Request Headers:", JSON.stringify(req.headers));

    // const authHeader = req?.headers['Authorization'];

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Token is required or malformed' });
    // }

    // const token = authHeader.split(' ')[1];  
    // console.log("Authentication token extracted:", token);

    try {
        // const decoded = JWT.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);
        // req.user = decoded; // Attach decoded token data to request
        next();
    } catch (error) {
        next(); 
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = authenticateToken;
