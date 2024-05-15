//validfatier nog toevoegen
//probleem met wachtwoord dubbelhashing


const connection = require('../db_connection').promise();
const express = require('express');
const bodyParser = require('body-parser'); //nodig om de res en req.body te kunnen gebruiken
const bcrypt = require('bcrypt');


const gebruikerAanpassen = async (req, res) => {
try {
    const { gebruikersnaam, functienr, voornaam, achternaam, emailadres, wachtwoord, idnr} = req.body;

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(wachtwoord, 10);

    const query = `
        UPDATE GEBRUIKERS 
        SET gebruikersnaam = ?, functienr = ?, voornaam = ?, achternaam = ?, emailadres = ?, wachtwoord = ?
        WHERE idnr = ?`;
    const [results] = await connection.query(query, [gebruikersnaam, functienr, voornaam, achternaam, emailadres, hashedPassword, idnr]);

    res.redirect('/home_gebruikers.html');

} catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating data.');
}
};

module.exports = { gebruikerAanpassen };