const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const verifyJWT = require('./middleware/verifyJWT');

// Gebruikersfuncties
const functies = {
    'manager': 1,
    'medewerker': 2,
    'boekhouder': 3
};

// Toegang voor iedereen
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});



// Handle login
router.post('/login', userLogin);
// Middleware to verify JWT
router.use(verifyJWT);


// Routes accessible for all logged-in users with roles 1, 2, or 3
router.get('/home_klantFacturen', (req, res) => {
    if (req.user.functienr === functies.manager || req.user.functienr === functies.medewerker || req.user.functienr === functies.boekhouder) {
        res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));
    } else {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
});

router.get('/home_levFacturen', (req, res) => {
    if (req.user.functienr === functies.manager || req.user.functienr === functies.medewerker || req.user.functienr === functies.boekhouder) {
        res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_levFacturen.html'));
    } else {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
});

// Routes accessible for medewerkers and manager

// Routes accessible only for manager

// Handle form submissions
router.post('/submit-form-nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

module.exports = router;
