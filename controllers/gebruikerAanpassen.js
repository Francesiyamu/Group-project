//validfatier nog toevoegen
//probleem met wachtwoord dubbelhashing


const connection = require('../config/db_connection');
const express = require('express');
const bodyParser = require('body-parser'); //nodig om de res en req.body te kunnen gebruiken
const bcrypt = require('bcrypt');


const gebruikerAanpassen = async (req, res) => {
    try {
        const { gebruikersnaam, functienr, voornaam, achternaam, emailadres, wachtwoord, idnr } = req.body;
        const [rows] = await connection.promise().query('SELECT wachtwoord FROM GEBRUIKERS WHERE idnr = ?', [idnr]);
        const oudWachtwoord = rows[0].wachtwoord;
        let hashedPassword = oudWachtwoord;

        // Check if the password has changed and needs to be hashed
        const isSamePassword = await bcrypt.compare(wachtwoord, oudWachtwoord);
        if (!isSamePassword) {
            hashedPassword = await bcrypt.hash(wachtwoord, 10);
        }

        const query = `
            UPDATE GEBRUIKERS 
            SET gebruikersnaam = ?, functienr = ?, voornaam = ?, achternaam = ?, emailadres = ?, wachtwoord = ?
            WHERE idnr = ?
        `;
        await connection.promise().query(query, [gebruikersnaam, functienr, voornaam, achternaam, emailadres, hashedPassword, idnr]);

    res.redirect('/home_gebruikers.html');

} catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating data.');
}
};

module.exports = { gebruikerAanpassen };