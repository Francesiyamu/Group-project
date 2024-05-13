const express = require('express');
const connection = require('../db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const userLogin = async (req, res) => {
    try {
        const { gebruikersnaam, wachtwoord} = req.body;
        const query = 'SELECT * FROM GEBRUIKERS WHERE gebruikersnaam = ?';

        const [rows, fields] = await connection.promise().query(query, [gebruikersnaam]);
        

        if (rows.length === 0) {
            res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }

        const user = rows[0]; // Assuming only one user with a unique username
        const functienr = user.functienr;
        console.log('Gebruiker gevonden:', user.gebruikersnaam , 'met functienr:', user.functienr );

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

        if (!isPasswordValid) {
            res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }

        // Authentication successful
        console.log('Authenticatie succesvol');
        // Create a JWT token       
        const accessToken = jwt.sign({ gebruikersnaam: user.gebruikersnaam },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }); // 1 hour expiration

        const refreshToken = jwt.sign({ gebruikersnaam: user.gebruikersnaam },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }); // 1 day expiration

        // Save refresh token in the database --- also used for logging out
        const insertQuery = 'INSERT INTO REFRESH_TOKENS (refresh_token, gebruikersnaam) VALUES (?, ?)';
        connection.query(insertQuery, [refreshToken, gebruikersnaam], (error, result) => {
            if (error) {
                console.error('Error in saving refresh token:', error);
                return res.status(500).json({ status: 'error', message: 'Internal server error' });
            }
            console.log('Refresh token saved');
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 24 hours expiration
                 
            
            res.json({status:'success', access_token: accessToken});
           
        });

    } catch (error) {
        console.error('Error in userLogin:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


module.exports = { userLogin };
