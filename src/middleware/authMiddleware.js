const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Get the JWT token from the request headers
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Authentication failed. Token missing.' });

        // Verify the token
        const decoded = jwt.verify(token, config.TOKEN_SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'Authentication failed. User not found.' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
};

module.exports = authMiddleware;
