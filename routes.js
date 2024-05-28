const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./config/db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const {validationRulesLev} = require('./controllers/validatorChain');
const authenticateToken = require('./middleware/authenticateToken');
const authenticateToken1 = require('./middleware/authenticateToken1');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const session = require('express-session');
const countries = require('./config/Countries');

router.use(session({
    secret: 'd831bf80b82841618a885b9a93280e5ca9e0bcbe4de61e2de8b3f31170e2395cdb24966f286130e3a8b94faddebd97ea6ddc0fccccb10407feb9047b95ab609f',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
    expires: 3600000
}));


// Toegang voor iedereen
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});
router.use(express.json());

// Handle login
router.post('/login', userLogin);
// -------------PROJECTEN---------------------------------------------------
router.get('/projecten/home_project.html', authenticateToken, (req, res) => {
    connection.query('SELECT projectnr, projectnaam, KLANTEN.voornaam, KLANTEN.achternaam, status, PROJECTEN.gemeente FROM PROJECTEN JOIN KLANTEN ON KLANTEN.klantnr=PROJECTEN.klantnr ', (error, results) => {
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'projecten', 'home_project'), { Projecten: results });
    });
});

router.get('/projecten/nieuw_project.html', authenticateToken , (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});
router.get('/projecten/aanpassen_project.html', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'aanpassen_project.html'));
});
router.get('/projecten/subpaginas_projecten.html', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'subpaginas_projecten.html'));
});
// ----------------GEBRUIKERS -------------------------------------------------------------
router.get('/gebruikers/home_gebruikers.html', authenticateToken1 , (req, res) => {
    connection.query('SELECT gebruikersnaam, voornaam, achternaam ,emailadres, idnr FROM GEBRUIKERS', (error, results, fields) => {
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'gebruikers', 'home_gebruikers'), { gebruikers: results });
    });
});
//nieuwe gebruiker
router.get('/gebruikers/nieuwe_gebruiker.html', authenticateToken1 , (req, res) => {
    connection.query('SELECT * FROM FUNCTIES', (error, functies) => {
    res.render(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker'), { functies: functies });
    });
});
//gebruiker aanpassen
router.get('/details_aanpassen_gebruiker',authenticateToken1 , (req, res) => {
    const id = req.query.var;
    connection.query('SELECT gebruikersnaam, GEBRUIKERS.functienr, voornaam, achternaam ,emailadres, functienaam, idnr FROM GEBRUIKERS JOIN FUNCTIES ON GEBRUIKERS.functienr = FUNCTIES.functienr WHERE GEBRUIKERS.idnr = ?', [id], (error, results) => {
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
router.post('/submit-form-aanpassen-gebruiker', authenticateToken1 , [
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
        res.redirect('/details_aanpassen_gebruiker?var='+idnr);

    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating data.');
    }
});
//delete gebruiker
router.get('/delete_gebruiker', authenticateToken1 , (req, res) => {
    const id = req.query.iddel;
    connection.query('DELETE FROM GEBRUIKERS WHERE idnr = ?', [id], (error, results) => {  
    });
    res.redirect('/gebruikers/home_gebruikers.html');
});   


// -----------------KLANTEN---------------------------------------------------------------
router.get('/klant/home_klant.html', authenticateToken,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'home_klant.html'));
});
router.get('/klant/nieuwe_klant.html', authenticateToken,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'nieuwe_klant.html'));
});
router.get('/klant/aanpassen_klant.html', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'aanpassen_klanten.html'));
});

// ----------------------------------- LEVERANCIERS -----------------------------------

// Toon bestaande leveranciers op home pagina
router.get('/leveranciers/home_leveranciers.html', authenticateToken,(req, res) => {
    connection.query('SELECT naam, gemeente, telefoonnr ,emailadres, levnr FROM LEVERANCIERS', (error, results) => {
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'leveranciers', 'home_leveranciers'), {leveranciers: results});
    });
});

// Verwijderen leverancier
router.get('/leveranciers/verwijderen_leverancier', authenticateToken,(req,res) => {
    const id = req.query.idnr;
    connection.query('DELETE FROM LEVERANCIERS WHERE levnr = ?',[id], (error,results) => {
        res.redirect('/leveranciers/home_leveranciers.html');
    })
})

// Toevoegen leverancier
router.get('/leveranciers/nieuwe_leverancier.html',authenticateToken,(req,res) => {
    // Check if errors from previous submission
    let errorMsg;
    let submittedData;
    if(req.query.errorsSubmission){ 
        const errorsSubmission = req.query.errorsSubmission;
        errorMsg = JSON.parse(errorsSubmission);

        submittedData = JSON.parse(decodeURIComponent(req.query.submittedData));

        console.log(errorMsg);
    }

    // Render page
    if(errorMsg) {
        res.render(path.join(__dirname,'views', 'leveranciers', 'nieuwe_leverancier'), {countries : countries, errors: errorMsg, data: submittedData});
    } else {
        res.render(path.join(__dirname,'views', 'leveranciers', 'nieuwe_leverancier'), {countries : countries});
    }
})


router.post('/leveranciers/submission_nieuwe_leverancier_form', authenticateToken, validationRulesLev(), async (req, res) => {
    console.log('nieuwe leverancier');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
    
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        StringifiedSubmittedData = encodeURIComponent(JSON.stringify(req.body)); // Necessary to recognize + of telefoonnr, expects string
        res.redirect(`/leveranciers/nieuwe_leverancier.html?errorsSubmission=${StringifiedErrorMsg}&submittedData=${StringifiedSubmittedData}`);
        //return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const {levnr, levnaam, straatnaam, huisnr, postcode, gemeente, land, telefoonnr, email, BTWnr} = req.body;
            let query = 'INSERT INTO LEVERANCIERS (naam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres, BTWnr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            await connection.promise().query(query,[levnaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, email, BTWnr]); 
            res.redirect('/leveranciers/home_leveranciers.html');
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

// Details leverancier
router.get('/leveranciers/details_aanpassen_leverancier.html', authenticateToken, (req,res) => {
    console.log('details leverancier');
    const id = req.query.nr;
    connection.query('SELECT levnr, naam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres, BTWnr FROM LEVERANCIERS WHERE levnr = ?', [id], (error, results) => {

    // Check if errors from previous submission
        let errorMsg;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);
        }

    // Render page
        if(errorMsg) {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0], countries : countries, errors: errorMsg});
        } else {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0], countries : countries});
        }
    })
})

// Aanpassen leverancier
router.post('/leveranciers/submission_update_leverancier_form', authenticateToken, validationRulesLev(), async (req, res) => {
    console.log('aanpassen leverancier');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
        
        let nr = req.body.levnr;
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        res.redirect(`/leveranciers/details_aanpassen_leverancier.html?nr=${nr}&errorsSubmission=${StringifiedErrorMsg}`);
        //return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const {levnr, levnaam, straatnaam, huisnr, postcode, gemeente, land, telefoonnr, email, BTWnr} = req.body;
            let query = 'UPDATE LEVERANCIERS SET naam = ?, straatnaam = ?, huisnr = ?, gemeente = ?, postcode = ?, land = ?, telefoonnr = ?, emailadres = ?, BTWnr = ? WHERE levnr = ?';
            await connection.promise().query(query,[levnaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, email, BTWnr, levnr]); 
            res.redirect('details_aanpassen_leverancier.html?nr=' + levnr);
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

//-------------------KLANTEN FACTUREN-----------------------------------------------------------
router.get('/klant_factuur/home_klantFacturen.html',authenticateToken, (req, res) => {
    connection.query('SELECT FACTUREN.factuurid, FACTUREN.factuurnr, KLANTEN.achternaam, KLANTEN.voornaam, FACTUREN.bedragNoBTW, FACTUREN.statusBetaling FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid= FACTUREN_KLANTEN.factuurid JOIN KLANTEN ON KLANTEN.klantnr=FACTUREN_KLANTEN.klantnr', (error, results) => {
        if (error) console.log(error);
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'klant_factuur', 'home_klantFacturen'), { Facturen: results });
    });
});

//-------------------LEVERANCIERS FACTUREN-----------------------------------------------------------



// -----------------Handle form submissions-----------------------------------------------------------
router.post('/submit-form-nieuw-project', authenticateToken, registreerNieuwProject);
router.post('/submit-form-nieuwe-gebruiker', authenticateToken, registreerGebruiker);






router.get('/set-token', (req, res) => {
    const token = req.query.token;
    const level = req.query.level;
    if (!token) {
        return res.status(400).json({ status: 'error', message: 'Token is required' });
    }
    req.session.token = token;
    req.session.level = level;
    res.redirect('/klant_factuur/home_klantFacturen.html');
});
// Route to logout and end the session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to end session' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/');
    });
});    


module.exports = router;
