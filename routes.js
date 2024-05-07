console.log('Hello from the routes file!');
const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');

//---------HOME-------------------------------------------------------------
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});

router.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

router.get('/login.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.js'));
});

// -------------PROJECTEN---------------------------------------------------
router.get('/nieuw_project', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});

router.get('/nieuw_project.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.css'));
});

router.get('/nieuw_project.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.js'));
});

// GEBRUIKERS -------------------------------------------------------------
router.get('/nieuwe_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.html'));
});

router.get('/nieuwe_gebruiker.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

router.get('/nieuwe_gebruiker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.js'));
});


// router.post('/nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuw-project', registreerNieuwProject);

// nieuwe gebruiker
// router.post('/nieuwe-gebruiker', registreerGebruiker);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

module.exports = router;
