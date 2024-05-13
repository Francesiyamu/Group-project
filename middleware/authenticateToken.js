const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    console.log(authHeader); // bearer token

    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized, no authHeader ' });
    }
   
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({ status: 'error', message: 'Unauthorized, no token' });
    }
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: 'Forbidden : Invalid token' }); 
            }
            req.user= user
            console.log(user.gebruikersnaam, user.functienr);
            next();
        }
    )
};

module.exports = authenticateToken;