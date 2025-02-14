const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => { 
    try {
        // Extract token from Authorization Header
        const authHeader = req.headers["authorization"];
        const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        // Extract token from Cookie
        const cookieToken = req.cookies?.token || null;

        // console.log("Header Token:", headerToken);
        // console.log("Cookies received:", req.cookies);
        // console.log("Cookie Token:", cookieToken);

        // Check if both tokens exist
        if (!headerToken && !cookieToken) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Ensure both tokens match (if both exist)
        if (headerToken && cookieToken && headerToken !== cookieToken) {
            return res.status(401).json({ message: "Unauthorized - Token mismatch" });
        }

        // Determine which token to verify (prefer header if both exist)
        const tokenToVerify = headerToken || cookieToken;

        // Verify token
        jwt.verify(tokenToVerify, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(403).json({ message: "Forbidden - Invalid token" });
            }

            req.user = decoded; // Attach user info to request
            next();
        });

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authenticateToken;
