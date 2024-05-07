const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');

//---------LOGIN-------------------------------------------------------------
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login','login.html'));
});

// -------------PROJECTEN---------------------------------------------------
router.get('/nieuw_project', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});

// GEBRUIKERS -------------------------------------------------------------
router.get('/nieuwe_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.html'));
});

// Handle form submissions
router.post('/submit-form-nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

module.exports = router;
