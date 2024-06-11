const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    const level = req.session.level;

    if (!token) {
        return  res.redirect('../login');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return  res.redirect('../login');
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;