const JWT = require('jsonwebtoken');

const authenticateToken = (req, res, next) => { 

        const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token is required' });

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid' });
    }
}  

module.exports = authenticateToken;