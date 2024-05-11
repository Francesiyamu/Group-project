const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    console.log("Request headers:", req.headers);
    console.log("Auth Header:", req.headers['Authorization']);
    const authHeader = req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: 'Forbidden' }); // invalid token
            }
            req.user = decoded;
            console.log(`het functienr van deze gebruiker is ${req.user.functienr}`);
            next();
        }
    )
    
};

module.exports = verifyJWT;