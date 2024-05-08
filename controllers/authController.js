const express = require('express');
const connection = require('../db_connection');
const mysql = require('mysql2');


const app = express();
const port = 3000;

app.use(express.json());


const userLogin = async (req, res) => {
    try{
        const { gebruikersnaam, wachtwoord } = req.body;
        const query = 'SELECT * FROM GEBRUIKERS WHERE gebruikersnaam = ? AND wachtwoord = ?';

        const result = await connection.promise().query(query, [gebruikersnaam, wachtwoord]);

        if(result.length === 0){
            res.status(401).json({status: 'error', message: 'Foute gebruikersnaam of wachtwoord'});
            console.log('Foute gebruikersnaam of wachtwoord');
            return;
        }
        //auth succesvol
        res.status(200).json({status: 'success', message: 'Authenticatie succesvol'});
        console.log('Authenticatie succesvol');
        
    } catch (error){
        console.error('Error in userLogin:', error);
        res.status(500).json({status: 'error', message: 'Internal server error'});
    }
    
};

module.exports = {userLogin}