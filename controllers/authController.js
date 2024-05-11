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
        const { gebruikersnaam, wachtwoord } = req.body;
        const query = 'SELECT * FROM GEBRUIKERS WHERE gebruikersnaam = ?';

        const [rows, fields] = await connection.promise().query(query, [gebruikersnaam]);

        if (rows.length === 0) {
            res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }

        const user = rows[0]; // Assuming only one user with a unique username
        //console.log('Gebruikersnaam:', user.gebruikersnaam);
        //console.log('Wachtwoord:', user.wachtwoord);
        //console.log('Functienr:', user.functienr    );

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

        if (!isPasswordValid) {
            res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }

        // Authentication successful
        // Create a JWT token       
        const access_token = jwt.sign({ gebruikersnaam: user.gebruikersnaam }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' }); //10 minutes
        const refresh_token = jwt.sign({ gebruikersnaam: user.gebruikersnaam }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' }); // 1 day

        //console.log('Access token:', access_token);
        //console.log('Refresh token:', refresh_token);   


        // Save refresh token in the database --- also used for logging out
        const insertQuery = 'INSERT INTO REFRESH_TOKENS (refresh_token, gebruikersnaam) VALUES (?, ?)';
        connection.query(insertQuery, [refresh_token, gebruikersnaam], (error, result) => {
            if (error) {
                console.error('Error in saving refresh token:', error);
                return res.status(500).json({ status: 'error', message: 'Internal server error' });
            }
            console.log('Refresh token saved');
            res.cookie('jwt', refresh_token, { httpOnly: true, maxAge: 24*60*60*1000, path: '/refresh_token' }) // 24h expiration
            //http only prevents client side javascript from accessing the cookie
            res.status(200).json({ status: 'success', message: `Authenticatie succesvol` , access_token});
            console.log(`The access token is ${access_token}`);
        });


    } catch (error) {
        console.error('Error in userLogin:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { userLogin };
