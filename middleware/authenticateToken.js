const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateToken = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    console.log('req.headers:', req.headers);
    console.log('accessToken:', accessToken);

    if(!accessToken){
        return res.status(401).json({ status: 'error', message: 'Unauthorized : No token provided' });
    }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: 'Forbidden : Invalid token' }); 
            }
            req.user= user;
            console.log(user.gebruikersnaam, user.functienr);
            next();
        }
    );
};

module.exports = authenticateToken;
