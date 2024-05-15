const connection = require('../config/db_connection').promise();
const express = require('express');
const bodyParser = require('body-parser'); //nodig om de res en req.body te kunnen gebruiken
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//check de gebruikers in de db
const getGebruikerByGebruikersnaam = async (gebruikersnaam) => {
    try {
        const query = 'SELECT * FROM GEBRUIKERS WHERE gebruikersnaam = ?';
        const [rows] = await connection.query(query, [gebruikersnaam]);

        if (rows.length === 0) {
            console.log('Gebruiker niet gevonden');
            return null; // User not found in the database
        } else {
            const user = rows[0];
            console.log('Gebruiker gevonden:', gebruikersnaam);
            return gebruikersnaam; // Return the user if found
        }
    } catch (error) {
        console.error(`Fout bij ophalen gebruiker met gebruikersnaam: ${gebruikersnaam}`, error);
        throw error;
    }
}
// Function to insert a new user into the database
const insertGebruiker = async (gebruikersnaam,functienr,voornaam,achternaam,emailadres,hashedWachtwoord) => {
    try {
        // const functienr = 1;
        const query = 'INSERT INTO GEBRUIKERS (gebruikersnaam,functienr,voornaam,achternaam,emailadres,wachtwoord) VALUES (?,?,?,?,?,?)';
        const [result] = await connection.query(query, [gebruikersnaam,functienr,voornaam,achternaam,emailadres,hashedWachtwoord]);
        return result.insertId; // Return the ID of the inserted user
    } catch (error) {
        console.error('Fout bij toevoegen nieuwe gebruiker:', error);
        throw error;
    }
}
//registration
const registreerGebruiker = async (req, res) => {
    try {
        const {gebruikersnaam,functienr,voornaam,achternaam,emailadres, wachtwoord } = req.body;
        console.log(`in de controller... `)
        console.log(req.body);

        if (!gebruikersnaam || !wachtwoord) {
            return res.status(400).json({ message: 'Gebruikersnaam en wachtwoord zijn verplicht' });
        }

        const bestaandeGebruiker = await getGebruikerByGebruikersnaam(gebruikersnaam);
        if (bestaandeGebruiker) {
            return res.status(409).json({ message: 'Gebruiker bestaat al' });
        }

        const hashedWachtwoord = await bcrypt.hash(wachtwoord, 10); // 10 salt rounds

        const nieuweGebruikerId = await insertGebruiker(gebruikersnaam,functienr,voornaam,achternaam,emailadres,hashedWachtwoord);
        console.log(`Nieuwe gebruiker toegevoegd met ID: ${nieuweGebruikerId}`);

        res.status(201).json({ message: 'Gebruiker geregistreerd' });
    } catch (error) {
        console.error(`Fout bij registreren gebruiker: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




    module.exports = {registreerGebruiker};
