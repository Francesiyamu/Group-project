const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./config/db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const {validationRulesLev} = require('./controllers/validatorChain');
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
router.get('/projecten/home_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'home_project.html'));
});
router.get('/projecten/nieuw_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'nieuw_project.html'));
});
router.get('/projecten/aanpassen_project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'aanpassen_project.html'));
});
router.get('/projecten/subpaginas_projecten.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'projecten', 'subpaginas_projecten.html'));
});
// ----------------GEBRUIKERS -------------------------------------------------------------
router.get('/gebruikers/home_gebruikers.html', (req, res) => {
    connection.query('SELECT gebruikersnaam, voornaam, achternaam ,emailadres, idnr FROM GEBRUIKERS', (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        res.render(path.join(__dirname, 'views', 'gebruikers', 'home_gebruikers'), { gebruikers: results });
    });
});
//nieuwe gebruiker
router.get('/gebruikers/nieuwe_gebruiker.html', (req, res) => {
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
        res.redirect('/gebruikers/home_gebruikers.html');

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
    res.redirect('/gebruikers/home_gebruikers.html');
});   


// -----------------KLANTEN---------------------------------------------------------------
router.get('/klant/home_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'home_klant.html'));
});
router.get('/klant/nieuwe_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'nieuwe_klant.html'));
});
router.get('/klant/aanpassen_klant.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'klant', 'aanpassen_klanten.html'));
});

// ----------------------------------- LEVERANCIERS -----------------------------------

// Toon bestaande leveranciers op home pagina
router.get('/leveranciers/home_leveranciers.html', (req, res) => {
    connection.query('SELECT naam, gemeente, telefoonnr ,emailadres, levnr FROM LEVERANCIERS', (error, results) => {
        console.log(results);
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'leveranciers', 'home_leveranciers'), {leveranciers: results});
    });
});

// Verwijderen leverancier
router.get('/leveranciers/verwijderen_leverancier', (req,res) => {
    console.log('verwijderen');
    const id = req.query.idnr;
    connection.query('DELETE FROM LEVERANCIERS WHERE levnr = ?',[id], (error,results) => {
        res.redirect('/leveranciers/home_leveranciers.html');
    })
})

// Toevoegen leverancier
router.get('/leveranciers/nieuwe_leverancier.html', (req,res) => {
    console.log('toevoegen');
    
    // Select & save next levnr
    let next_id;
    connection.query('SELECT levnr FROM LEVERANCIERS ORDER BY levnr DESC LIMIT 1', (errors, result) => { // Select last registerd levnr
        if(result != undefined) {
            console.log(result[0].levnr);
            next_id = {levnr: result[0].levnr + 1};
        } else {
            next_id = {levnr: 1};
        }

        // Check if errors from previous submission
        let errorMsg;
        let submittedData;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);

            submittedData = JSON.parse(decodeURIComponent(req.query.submittedData));
        }

    // Render page
        if(errorMsg) {
            res.render(path.join(__dirname,'views', 'leveranciers', 'nieuwe_leverancier'), {leverancier: next_id, errors: errorMsg, data: submittedData});
        } else {
            res.render(path.join(__dirname,'views', 'leveranciers', 'nieuwe_leverancier'), {leverancier: next_id});
        }
    })
})

router.post('/leveranciers/submission_nieuwe_leverancier_form', validationRulesLev(), async (req, res) => {
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
            let query = 'INSERT INTO LEVERANCIERS (levnr, naam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres, BTWnr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            await connection.promise().query(query,[levnr, levnaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, email, BTWnr]); 
            res.redirect('/leveranciers/home_leveranciers.html');
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

// Details leverancier
router.get('/leveranciers/details_aanpassen_leverancier.html', (req,res) => {
    console.log('details leverancier');
    const id = req.query.nr;
    connection.query('SELECT levnr, naam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres, BTWnr FROM LEVERANCIERS WHERE levnr = ?', [id], (error, results) => {
        console.log(results[0]);

    // Check if errors from previous submission
        let errorMsg;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);
        }

    // Render page
        if(errorMsg) {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0], errors: errorMsg});
        } else {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0]});
        }
    })
})

// Aanpassen leverancier
router.post('/leveranciers/submission_update_leverancier_form', validationRulesLev(), async (req, res) => {
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
