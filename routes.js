
console.log('Hello from the routes file!');
const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');

    // Serve the home page
    router.get('/', (req, res) => {
        res.sendFile(__dirname + '/views/home/index.html');
    });

    // Serve the form page for creating a new project
    router.get('/nieuw_project', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.html');
    });
    router.get('/nieuw_project.css', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.css');
    });
    router.get('/nieuw_project.js', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.js');
    });
//GEBRUIKERS -------------------------------------------------------------
    router.get('/nieuwe_gebruiker', (req, res) => {
        res.sendFile(__dirname + '/views/gebruikers/nieuwe_gebruiker.html');
    });
    router.get('/nieuwe_gebruiker.css', (req, res) => {
        res.sendFile(__dirname + '/views/gebruikers/nieuwe_gebruiker.css', {
            headers: {
                'Content-Type': 'text/css'
            }
        });
    });
    
    router.get('/nieuwe_gebruiker.js', (req, res) => {
        res.sendFile(__dirname + '/views/gebruikers/nieuwe_gebruiker.js');
    });
    
    //nieuw project
    //router.post('/nieuw-project', registreerNieuwProject);
    router.post('/submit-form-nieuw-project', registreerNieuwProject);

    //nieuwe gebruiker
    //router.post('/nieuwe-gebruiker', registreerGebruiker);
    router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

module.exports = router;





