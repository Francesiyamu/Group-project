const express = require('express');
const connection = require('../config/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const userLogin = async (req, res) => {
    try {
        const { gebruikersnaam, wachtwoord } = req.body;
        const query = 'SELECT * FROM GEBRUIKERS WHERE gebruikersnaam = ?';

        const [rows, fields] = await connection.promise().query(query, [gebruikersnaam]);

        if (rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
        }

        const user = rows[0]; // Assuming only one user with a unique username
        console.log('Ik ben de gebruiker : ', user.gebruikersnaam , 'met functienr : ', user.functienr);

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(wachtwoord, user.wachtwoord);
        console.log('Is password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
        }

      const level = user.functienr

        // Create a JWT token       
        const accessToken = jwt.sign(user,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }); // 1 hour expiration
            
        
        console.log('Access token:', accessToken);
        // res.set('Authorization', `Bearer ${accessToken}`)
        res.json({ status: 'success', accessToken , level });
       
        

    } catch (error) {
        console.error('Error in userLogin:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { userLogin };
