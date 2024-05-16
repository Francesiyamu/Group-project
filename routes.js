const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./config/db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const authenticateToken = require('./middleware/authenticateToken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');



// Toegang voor iedereen
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});

router.get('/login', userLogin);


// Toegang voor ingelogde gebruikers
router.get('/home', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));    
});
/* router.get('/protected-route', authenticateToken, (req, res) => {
    const { gebruikersnaam, functienr } = req.user;
    if (functienr === 1 || functienr === 2 || functienr === 3) {
        res.send('This is a protected route');
    } else {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
}); */
/* router.get('/home_klantFacturen,', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen.html'));
}); */

// -------------PROJECTEN---------------------------------------------------
router.get('/home_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'home_project.html'));
});
router.get('/nieuw_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});
router.get('/aanpassen_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'aanpassen_project.html'));
});
router.get('/subpaginas_projecten.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'subpaginas_projecten.html'));
});
// ----------------GEBRUIKERS -------------------------------------------------------------
router.get('/home_gebruikers.html', (req, res) => {
    connection.query('SELECT gebruikersnaam, voornaam, achternaam ,emailadres, idnr FROM GEBRUIKERS', (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        res.render(path.join(__dirname, 'views', 'gebruikers', 'home_gebruikers'), { gebruikers: results });
    });
});
//nieuwe gebruiker
router.get('/nieuwe_gebruiker.html', (req, res) => {
    connection.query('SELECT * FROM FUNCTIES', (error, functies) => {
    res.render(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker'), { functies: functies });
    });
});
//gebruiker aanpassen
router.get('/details_aanpassen_gebruiker', (req, res) => {
    const id = req.query.var;
    connection.query('SELECT gebruikersnaam, GEBRUIKERS.functienr, voornaam, achternaam ,emailadres, functienaam, idnr FROM GEBRUIKERS JOIN FUNCTIES ON GEBRUIKERS.functienr = FUNCTIES.functienr WHERE GEBRUIKERS.idnr = ?', [id], (error, results) => {
        console.log(results)
        connection.query('SELECT * FROM FUNCTIES', (error, functies) => {
            functies.sort((a, b) => {
                if (a.functienaam === results[0].functienaam) return -1;
                if (b.functienaam === results[0].functienaam) return 1;
                return a.functienaam.localeCompare(b.functienaam);
            });
            res.render(path.join(__dirname, 'views', 'gebruikers', 'details_aanpassen_gebruiker'), { result: results[0], functies: functies });
        });
    });
});
//gebruikers aanpassen retour
router.post('/submit-form-aanpassen-gebruiker', [
    body('gebruikersnaam').isString().notEmpty().withMessage('Gebruikersnaam is required'),
    body('functienr').isNumeric().withMessage('Functienr must be a number'),
    body('voornaam').isString().notEmpty().withMessage('Voornaam is required'),
    body('achternaam').isString().notEmpty().withMessage('Achternaam is required'),
    body('emailadres').isEmail().withMessage('Invalid email address'),
    body('wachtwoord').isString().notEmpty().withMessage('Wachtwoord is required'),
    body('idnr').isNumeric().withMessage('Idnr must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { gebruikersnaam, functienr, voornaam, achternaam, emailadres, wachtwoord, idnr } = req.body;
        const [rows] = await connection.promise().query('SELECT wachtwoord FROM GEBRUIKERS WHERE idnr = ?', [idnr]);
        const oudWachtwoord = rows[0].wachtwoord;
        const isSamePassword = await bcrypt.compare(wachtwoord, oudWachtwoord);
        let hashedPassword = oudWachtwoord;
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
});
//delete gebruiker
router.get('/delete_gebruiker', (req, res) => {
    const id = req.query.iddel;
    connection.query('DELETE FROM GEBRUIKERS WHERE idnr = ?', [id], (error, results) => {  
    });
    res.redirect('/home_gebruikers.html');
});   




// -----------------KLANTEN---------------------------------------------------------------
router.get('/home_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'home_klant.html'));
});
router.get('/nieuwe_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'nieuwe_klant.html'));
});
router.get('/aanpassen_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'aanpassen_klanten.html'));
});
//-------------------KLANTEN FACTUREN-----------------------------------------------------------


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



// -----------------Handle form submissions-----------------------------------------------------------
router.post('/submit-form-nieuw-project', registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', registreerGebruiker);





// Handle login
router.post('/login', userLogin);


module.exports = router;
