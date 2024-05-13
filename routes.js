const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const authenticateToken = require('./middleware/authenticateToken');

// Toegang voor iedereen
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});

// Handle login
router.post('/login', userLogin);

// Routes accessible for all logged-in users with roles 1, 2, or 3
router.get('/home',authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));
});

/* router.get('/home_klantFacturen', (req, res) => {
    // This route is accessible for all users
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));
});

router.get('/home_levFacturen', (req, res) => {
    const { functienr } = req.user;
    // Check if the user has access to this route based on functienr
    if (functienr === 1 || functienr === 2 || functienr === 3) {
        res.sendFile(path.join(__dirname, 'views', 'lev_Factuur', 'home_levFacturen.html'));
    } else {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
});
 */
// Routes accessible for medewerkers and manager

// Routes accessible only for manager

// Handle form submissions
router.post('/submit-form-nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);

module.exports = router;
