const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    const level = req.session.level;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided ' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;