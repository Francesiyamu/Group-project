const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');


//---------ROOT -- LOGINPAGINA-------------------------------------------------------------
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login','login.html'));
});

// -------------PROJECTEN---------------------------------------------------
router.get('/home_project', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'home_project.html'));
});
router.get('/nieuw_project', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});
router.get('/aanpassen_project', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'aanpassen_project.html'));
});
router.get('/subpaginas_projecten', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'subpaginas_projecten.html'));
});
// ----------------GEBRUIKERS -------------------------------------------------------------
router.get('/home_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'home_gebruiker.html'));
});
router.get('/nieuwe_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.html'));
});
router.get('/aanpassen_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'aanpassen_gebruiker.html'));
});
// -----------------KLANTEN---------------------------------------------------------------
router.get('/home_klant', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'home_klant.html'));
});
router.get('/nieuwe_klant', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'nieuwe_klant.html'));
});
router.get('/aanpassen_klant,', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'aanpassen_klanten.html'));
});
//-------------------KLANTEN FACTUREN-----------------------------------------------------------
router.get('/home_klantFacturen,', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));
});
router.get('/nieuw_KlantFactuur,', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'nieuw_KlantFactuur.html'));
});
router.get('/aanpassen_KlantFactuur,', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'aanpassen_KlantFactuur.html'));
});


//-------------------LEVERANCIERS---------------------------------------------------------
router.get('/home_leveranciers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'leverancier', 'home_leveranciers.html'));
});
router.get('/nieuwe_leveranciers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'leverancier', 'nieuwe_leveranciers.html'));
});
router.get('/aanpassen_leveranciers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'leverancier', 'aanpassen_leveranciers.html'));
});
//-------------------LEVERANCIERS FACTUREN-----------------------------------------------------------
router.get('/fact-lev-aanpassen', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lev_Factuur', 'fact-lev-aanpassen.html'));
});
router.get('/factuur_lev_toe', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lev_Factuur', 'factuur_lev_toe.html'));
});
router.get('/home_levFacturen', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lev_Factuur', 'home_levFacturen.html'));
});



// Handle form submissions
router.post('/submit-form-nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

// Handle login
router.post('/login', userLogin);


module.exports = router;
