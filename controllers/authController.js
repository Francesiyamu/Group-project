const express = require('express');
const connection = require('../db_connection');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();;
const fsPromises = require('fs').promises;
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

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

        if (!isPasswordValid) {
            res.status(401).json({ status: 'error', message: 'Foute gebruikersnaam of wachtwoord' });
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }

        // Authentication successful
        // Create a JWT token       
        const accessToken = jwt.sign({ gebruikersnaam: user.gebruikersnaam}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' }); //10 minutes
        const refreshToken = jwt.sign({ gebruikersnaam: user.gebruikersnaam}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' }); // 1 day

        // Save refresh token in the database
        const insertQuery = 'INSERT INTO REFRESH_TOKENS (token) VALUES (?)';



        res.status(200).json({ status: 'success', message: 'Authenticatie succesvol' });
        console.log('Authenticatie succesvol');

    } catch (error) {
        console.error('Error in userLogin:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { userLogin };
