const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./config/db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const {validationRulesLev, validationRulesKlant, validationRulesProject,validationRulesGebruiker} = require('./controllers/validatorChain');
const {remove_object_item, remove_array_item} = require('./config/remove');
const authenticateToken3 = require('./middleware/authenticateToken3');
const authenticateToken2 = require('./middleware/authenticateToken2');
const authenticateToken1 = require('./middleware/authenticateToken1');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();
const session = require('express-session');
const countries = require('./config/Countries');
const status = require('./config/status');
const multer = require('multer');

//Multer settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

//Session settings
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
    expires: 36000000
}));

// --------------------------Algemene toegangen ----------------------------------------------------
// Toegang voor iedereen
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login', 'login.html'));
});
router.use(express.json());

//files beveiligde toegang
router.use('/files',authenticateToken3, express.static(path.join(__dirname, 'uploads')))

// Handle login
router.post('/login', userLogin);
//Set token
router.get('/set-token', (req, res) => {
    const token = req.query.token;
    const level = req.query.level;
    if (!token) {
        return res.status(400).json({ status: 'error', message: 'Token is required' });
    }
    req.session.token = token;
    req.session.level = level;
    if (level === '1') {
        res.redirect('/chartspage');
    } else {
        res.redirect('/klant_factuur/home_klantFacturen.html');
    }
    
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

// ----------------------------------- PROJECTEN -----------------------------------

// Toon bestaande projecten op home pagina
router.get('/projecten/home_projecten.html', authenticateToken2, (req, res) => {
    connection.query('SELECT projectnr, projectnaam, KLANTEN.voornaam, KLANTEN.achternaam, status, PROJECTEN.gemeente FROM PROJECTEN JOIN KLANTEN ON KLANTEN.klantnr=PROJECTEN.klantnr ORDER BY projectnr', (error, results) => {
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'projecten', 'home_projecten'), { projecten: results });
    });
});

// Verwijderen project
router.get('/projecten/verwijderen_project', authenticateToken2,(req,res) => {
    console.log('verwijderen project');
    const id = req.query.id;
    connection.query('DELETE FROM PROJECTEN WHERE projectnr = ?',[id], (error,results) => {
        res.redirect('/projecten/home_projecten.html');
    })
})

// Toevoegen project
router.get('/projecten/nieuw_project.html', authenticateToken2,(req,res) => {
    // Check if errors from previous submission
    let errorMsg;
    let submittedData;
    if(req.query.errorsSubmission){ 
        const errorsSubmission = req.query.errorsSubmission;
        errorMsg = JSON.parse(errorsSubmission);

        submittedData = JSON.parse(decodeURIComponent(req.query.submittedData));

        console.log(errorMsg);
    }

    //Haal klantendata op 
    connection.query('SELECT klantnr, voornaam, achternaam FROM KLANTEN',(error,results) => {
        // Render page
        if(errorMsg) {
            res.render(path.join(__dirname,'views', 'projecten', 'nieuw_project'), {countries: countries, status: status, klanten: results, errors: errorMsg, data: submittedData});
        } else {
            res.render(path.join(__dirname,'views', 'projecten', 'nieuw_project'), {countries: countries, status: status, klanten: results});
        }
    })
})


//Nieuw project POST
router.post('/projecten/submission_nieuw_project_form', authenticateToken2, validationRulesProject(), async (req, res) => {
    console.log('nieuw project');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
    
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        StringifiedSubmittedData = encodeURIComponent(JSON.stringify(req.body)); // Necessary to recognize + of telefoonnr, expects string
        res.redirect(`/projecten/nieuw_project.html?errorsSubmission=${StringifiedErrorMsg}&submittedData=${StringifiedSubmittedData}`);
    } else {
        try {
            const {projectnr, klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land} = req.body;
            let query = 'INSERT INTO PROJECTEN (klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            await connection.promise().query(query,[klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land]); 
            res.redirect('/projecten/home_projecten.html');
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

// Subpagina's project
router.get('/projecten/subpaginas_project.html', authenticateToken2,(req, res) => {
    const id = req.query.id;

    connection.query('SELECT projectnaam FROM PROJECTEN WHERE projectnr = ?', [id], (error, project) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Internal Server Error');
        }
        const projectnaam = project.length > 0 ? project[0].projectnaam : 'Unknown';
        const queryFacturenLev = "SELECT TOEWIJZINGEN.factuurid, ROUND(bedragNoBTW , 2) AS bedragNoBTW, factuurnr, DATE_FORMAT(factuurDatum, '%d/%m/%Y') AS factuurDatum , LEVERANCIERS.naam FROM TOEWIJZINGEN JOIN FACTUREN ON FACTUREN.factuurid = TOEWIJZINGEN.factuurid JOIN FACTUREN_LEVERANCIERS ON TOEWIJZINGEN.factuurid = FACTUREN_LEVERANCIERS.factuurid JOIN LEVERANCIERS ON FACTUREN_LEVERANCIERS.levnr = LEVERANCIERS.levnr WHERE projectnr = ?";
        connection.query(queryFacturenLev, [id], (error, levFact) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Internal Server Error');
            }
            levFact.forEach(row => {
                row.bedragNoBTW = row.bedragNoBTW.toFixed(2);
            });
            connection.query('SELECT SUM(bedragNoBTW) AS total_bedragNoBTW FROM TOEWIJZINGEN JOIN FACTUREN ON FACTUREN.factuurid = TOEWIJZINGEN.factuurid JOIN FACTUREN_LEVERANCIERS ON TOEWIJZINGEN.factuurid = FACTUREN_LEVERANCIERS.factuurid WHERE projectnr = ?', [id], (error, totaal) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).send('Internal Server Error');
                }
                let totaalLev = totaal.length > 0 ? totaal[0].total_bedragNoBTW : 'Unknown';
                if (totaalLev) {
                    totaalLev = totaalLev.toFixed(2);
                } else {
                    totaalLev = 0.00
                    totaalLev = totaalLev.toFixed(2)
                }
                const queryFacturenKlant = "SELECT TOEWIJZINGEN.factuurid, ROUND(bedragNoBTW , 2) AS bedragNoBTW, factuurnr, DATE_FORMAT(factuurDatum, '%d/%m/%Y') AS factuurDatum , KLANTEN.voornaam, KLANTEN.achternaam FROM TOEWIJZINGEN JOIN FACTUREN ON FACTUREN.factuurid = TOEWIJZINGEN.factuurid JOIN FACTUREN_KLANTEN ON TOEWIJZINGEN.factuurid = FACTUREN_KLANTEN.factuurid JOIN KLANTEN ON FACTUREN_KLANTEN.klantnr = KLANTEN.klantnr WHERE projectnr = ?";
                connection.query(queryFacturenKlant, [id], (error, klantFact) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        return res.status(500).send('Internal Server Error');
                    }
                    klantFact.forEach(row => {
                        row.bedragNoBTW = row.bedragNoBTW.toFixed(2);
                    });
                    connection.query('SELECT SUM(bedragNoBTW) AS total_bedragNoBTW FROM TOEWIJZINGEN JOIN FACTUREN ON FACTUREN.factuurid = TOEWIJZINGEN.factuurid JOIN FACTUREN_KLANTEN ON TOEWIJZINGEN.factuurid = FACTUREN_KLANTEN.factuurid WHERE projectnr = ?', [id], (error, totaalKlantDB) => {
                        if (error) {
                            console.error('Error executing query:', error);
                            return res.status(500).send('Internal Server Error');
                        }
                        let totaalKlant = totaalKlantDB.length > 0 ? totaalKlantDB[0].total_bedragNoBTW : 'Unknown';
                        if (totaalKlant) {
                            totaalKlant = totaalKlant.toFixed(2);
                        } else {
                            totaalKlant = 0.00
                            totaalKlant = totaalKlant.toFixed(2)
                        }
                        let marge = totaalKlant - totaalLev
                        if (marge) {
                            marge = marge.toFixed(2);
                        } else {
                            marge = 0.00
                            marge = marge.toFixed(2)
                        }
                        connection.query('SELECT KLANTEN.klantnr, KLANTEN.voornaam, KLANTEN.achternaam, PROJECTEN.gemeente, PROJECTEN.postcode, PROJECTEN.straatnaam, PROJECTEN.status, PROJECTEN.huisnr, PROJECTEN.land FROM PROJECTEN JOIN KLANTEN ON KLANTEN.klantnr = PROJECTEN.klantnr WHERE projectnr = ?', [id], (error, projectgegevens) => {
                            if (error) {
                                console.error('Error executing query:', error);
                                return res.status(500).send('Internal Server Error');
                            }

                            res.render(path.join(__dirname, 'views', 'projecten', 'subpaginas_project'), { projectnr: id, projectnaam: projectnaam, levFact: levFact, totaalLev: totaalLev, totaalKlant: totaalKlant, klantFact: klantFact, marge: marge, projectgegevens: projectgegevens[0] });
                        });
                    });
                });
            });
        });
    });
});


// Details project
router.get('/projecten/details_aanpassen_project.html', authenticateToken2, (req,res) => {
    console.log('details project');
    const id = req.query.id;
    connection.query('SELECT projectnr, klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land FROM PROJECTEN WHERE projectnr = ?', [id], (error, results) => {

    // Check if errors from previous submission
        let errorMsg;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);
        }
        console.log(results[0])

        connection.query('SELECT klantnr, voornaam, achternaam FROM KLANTEN where klantnr = ?', [results[0].klantnr], (error,results_klant) => {
            connection.query('SELECT klantnr, voornaam, achternaam FROM KLANTEN', (error, alle_klanten) => { //Kan vervangen worden als eq werkt
               // Remove selected from dropdown
               alle_klanten = remove_object_item(results_klant,'klantnr',alle_klanten);
               let countries_adapted = remove_array_item(results,'land',countries);
               let status_adapted = remove_array_item(results,'status',status);
                
                // Render page
                if(errorMsg) {
                    res.render(path.join(__dirname, 'views', 'projecten', 'details_aanpassen_project'), {project: results[0], klant: results_klant[0], klanten: alle_klanten, status: status_adapted, countries : countries_adapted, errors: errorMsg});
                } else {
                    res.render(path.join(__dirname, 'views', 'projecten', 'details_aanpassen_project'), {project: results[0], klant: results_klant[0], klanten: alle_klanten, status: status_adapted, countries : countries_adapted});
                }
            })
        })
    })
})

// Aanpassen project
router.post('/projecten/submission_update_project_form', authenticateToken2, validationRulesProject(), async (req, res) => {
    console.log('aanpassen project');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
        
        let id = req.body.projectnr;
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        res.redirect(`/projecten/details_aanpassen_project.html?id=${id}&errorsSubmission=${StringifiedErrorMsg}`);
    } else {
        try {
            const {projectnr, projectnaam, klantnr, status, straatnaam, huisnr, gemeente, postcode, land} = req.body;
            let query = 'UPDATE PROJECTEN SET projectnaam = ?, klantnr = ?, status = ?, straatnaam = ?, huisnr = ?, gemeente = ?, postcode = ?, land = ? WHERE projectnr = ?';
            await connection.promise().query(query,[projectnaam, klantnr, status, straatnaam, huisnr, gemeente, postcode, land, projectnr]); 
            res.redirect('/projecten/details_aanpassen_project.html?id=' + projectnr);
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

//toevoegen nieuwe project
router.post('/submit-form-nieuw-project', authenticateToken2, registreerNieuwProject);


// ----------------------------------- GEBRUIKERS -----------------------------------

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

    // Check if errors from previous submission
    let errorMsg;
    if(req.query.errorsSubmission){ 
        const errorsSubmission = req.query.errorsSubmission;
        errorMsg = JSON.parse(errorsSubmission);
    }

    connection.query('SELECT gebruikersnaam, GEBRUIKERS.functienr, voornaam, achternaam ,emailadres, functienaam, idnr FROM GEBRUIKERS JOIN FUNCTIES ON GEBRUIKERS.functienr = FUNCTIES.functienr WHERE GEBRUIKERS.idnr = ?', [id], (error, results) => {
        connection.query('SELECT * FROM FUNCTIES', (error, functies) => {
            functies.sort((a, b) => {
                if (a.functienaam === results[0].functienaam) return -1;
                if (b.functienaam === results[0].functienaam) return 1;
                return a.functienaam.localeCompare(b.functienaam);
            });

            if(errorMsg) {
                res.render(path.join(__dirname, 'views', 'gebruikers', 'details_aanpassen_gebruiker'), { result: results[0], functies: functies, errors: errorMsg });
            } else {
                res.render(path.join(__dirname, 'views', 'gebruikers', 'details_aanpassen_gebruiker'), { result: results[0], functies: functies });
            }    
        });
    });
});

//gebruikers aanpassen retour
router.post('/submit-form-aanpassen-gebruiker', authenticateToken1 , validationRulesGebruiker(), async (req, res) => {
    console.log('submit')
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
        
        const id = req.body.idnr;
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        res.redirect(`/details_aanpassen_gebruiker?var=${id}&errorsSubmission=${StringifiedErrorMsg}`);
    } else {
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
    }
});

//delete gebruiker
router.get('/delete_gebruiker', authenticateToken1 , (req, res) => {
    const id = req.query.iddel;
    connection.query('DELETE FROM GEBRUIKERS WHERE idnr = ?', [id], (error, results) => {  
    });
    res.redirect('/gebruikers/home_gebruikers.html');
});   

//nieuwe gebruiker
router.post('/submit-form-nieuwe-gebruiker', authenticateToken1, registreerGebruiker);


// ----------------------------------- KLANTEN -----------------------------------

// Toon bestaande klanten op home pagina
router.get('/klanten/home_klanten.html', authenticateToken2,(req, res) => {
    connection.query('SELECT klantnr, voornaam, achternaam, emailadres, telefoonnr FROM KLANTEN', (error, results) => {
        if(error) throw error;
        console.log(results)
        res.render(path.join(__dirname,'views', 'klanten', 'home_klanten'), {klanten: results})
    })
});

// Verwijderen klant
router.get('/klanten/verwijderen_klant', authenticateToken2,(req,res) => {
    const id = req.query.id;
    connection.query('DELETE FROM KLANTEN WHERE klantnr = ?',[id], (error,results) => {
        res.redirect('/klanten/home_klanten.html');
    })
})

//Toevoegen klant
router.get('/klanten/nieuwe_klant',authenticateToken2,(req,res) => {
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
        res.render(path.join(__dirname,'views', 'klanten', 'nieuwe_klant'), {countries : countries, errors: errorMsg, data: submittedData});
    } else {
        res.render(path.join(__dirname,'views', 'klanten', 'nieuwe_klant'), {countries : countries});
    }
})

router.post('/klanten/submission_nieuwe_klant_form', authenticateToken2, validationRulesKlant(), async (req, res) => {
    console.log('nieuwe klant');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
    
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        StringifiedSubmittedData = encodeURIComponent(JSON.stringify(req.body)); // Necessary to recognize + of telefoonnr, expects string
        res.redirect(`/klanten/nieuwe_klant.html?errorsSubmission=${StringifiedErrorMsg}&submittedData=${StringifiedSubmittedData}`);
    } else {
        try {
            const {klantnr, voornaam, achternaam, straatnaam, huisnr, postcode, gemeente, land, telefoonnr, email} = req.body;
            let query = 'INSERT INTO KLANTEN (voornaam, achternaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            await connection.promise().query(query,[voornaam, achternaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, email]); 
            res.redirect('/klanten/home_klanten.html');
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

// Details klant
router.get('/klanten/details_aanpassen_klant.html', authenticateToken2, (req,res) => {
    console.log('details klant');
    const id = req.query.id;
    connection.query('SELECT klantnr, voornaam, achternaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres FROM KLANTEN WHERE klantnr = ?', [id], (error, results) => {
    // Check if errors from previous submission
        let errorMsg;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);
        }
        console.log(results[0])

    // Remove selected item from dropdown
    let countries_adapted = remove_array_item(results,'land',countries);

    // Render page
        if(errorMsg) {
            res.render(path.join(__dirname, 'views', 'klanten', 'details_aanpassen_klant'), {countries : countries_adapted, klant: results[0], errors: errorMsg});
        } else {
            res.render(path.join(__dirname, 'views', 'klanten', 'details_aanpassen_klant'), {countries : countries_adapted, klant: results[0]});
        }
    })
})

// Aanpassen klant
router.post('/klanten/submission_update_klant_form', authenticateToken2, validationRulesKlant(), async (req, res) => {
    console.log('aanpassen klant');
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let errorMsg = [];
        for(let error of errors.array()) {
            errorMsg.push(error.msg);
        }
        
        let id = req.body.klantnr;
        StringifiedErrorMsg = JSON.stringify(errorMsg);
        res.redirect(`/klanten/details_aanpassen_klant.html?id=${id}&errorsSubmission=${StringifiedErrorMsg}`);
    } else {
        try {
            const {klantnr, voornaam, achternaam, straatnaam, huisnr, postcode, gemeente, land, telefoonnr, email} = req.body;
            let query = 'UPDATE KLANTEN SET voornaam = ?, achternaam = ?, straatnaam = ?, huisnr = ?, gemeente = ?, postcode = ?, land = ?, telefoonnr = ?, emailadres = ? WHERE klantnr = ?';
            await connection.promise().query(query,[voornaam, achternaam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, email, klantnr]); 
            res.redirect('details_aanpassen_klant.html?id=' + klantnr);
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while adding data.');
        }
    }
})

// ----------------------------------- LEVERANCIERS -----------------------------------

// Toon bestaande leveranciers op home pagina
router.get('/leveranciers/home_leveranciers.html', authenticateToken2,(req, res) => {
    connection.query('SELECT naam, gemeente, telefoonnr ,emailadres, levnr FROM LEVERANCIERS', (error, results) => {
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'leveranciers', 'home_leveranciers'), {leveranciers: results});
    });
});

// Verwijderen leverancier
router.get('/leveranciers/verwijderen_leverancier', authenticateToken2,(req,res) => {
    const id = req.query.idnr;
    connection.query('DELETE FROM LEVERANCIERS WHERE levnr = ?',[id], (error,results) => {
        res.redirect('/leveranciers/home_leveranciers.html');
    })
})

// Toevoegen leverancier
router.get('/leveranciers/nieuwe_leverancier.html',authenticateToken2,(req,res) => {
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


router.post('/leveranciers/submission_nieuwe_leverancier_form', authenticateToken2, validationRulesLev(), async (req, res) => {
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
router.get('/leveranciers/details_aanpassen_leverancier.html', authenticateToken2, (req,res) => {
    
    const id = req.query.nr;
    connection.query('SELECT levnr, naam, straatnaam, huisnr, gemeente, postcode, land, telefoonnr, emailadres, BTWnr FROM LEVERANCIERS WHERE levnr = ?', [id], (error, results) => {

    // Check if errors from previous submission
        let errorMsg;
        if(req.query.errorsSubmission){ 
            const errorsSubmission = req.query.errorsSubmission;
            errorMsg = JSON.parse(errorsSubmission);
        }

    // Remove selected item from dropdown
    let countries_adapted = remove_array_item(results,'land',countries);

    // Render page
        if(errorMsg) {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0], countries : countries_adapted, errors: errorMsg});
        } else {
            res.render(path.join(__dirname, 'views', 'leveranciers', 'details_aanpassen_leverancier'), {leverancier: results[0], countries : countries_adapted});
        }
    })
})

// Aanpassen leverancier
router.post('/leveranciers/submission_update_leverancier_form', authenticateToken2, validationRulesLev(), async (req, res) => {


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

router.get('/klant_factuur/home_klantFacturen.html', authenticateToken3, (req, res) => {
    
    connection.query("SELECT FACTUREN.factuurid, DATE_FORMAT(FACTUREN.factuurDatum, '%d/%m/%Y') AS factuurDatum , FACTUREN.factuurnr, KLANTEN.achternaam, FACTUREN.BTWperc, KLANTEN.voornaam, FACTUREN.bedragNoBTW, FACTUREN.statusBetaling FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid= FACTUREN_KLANTEN.factuurid JOIN KLANTEN ON KLANTEN.klantnr=FACTUREN_KLANTEN.klantnr", (error, results) => {
        if (error) console.log(error);
        if (error) throw error;
        res.render('klant_factuur/home_klantFacturen', { Facturen: results });
    });
});
//klantfact aanpassen GET
router.get('/klant_factuur/details_aanpassen_klantFactuur.html', authenticateToken3, (req, res) => {
    const id = req.query.var;
    let klantaanpassenquery ="SELECT FACTUREN.factuurid, PROJECTEN.projectnr, factuurnr,KLANTEN.achternaam, KLANTEN.voornaam, DATE_FORMAT(FACTUREN.factuurDatum, '%Y-%m-%d') AS factuurDatum, beschrijving, BTWperc, statusBetaling, projectnaam, bedragNoBTW, DATE_FORMAT(FACTUREN.DatumBetaling, '%Y-%m-%d') AS DatumBetaling, FACTUREN_KLANTEN.klantnr FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid JOIN TOEWIJZINGEN on FACTUREN.factuurid=TOEWIJZINGEN.factuurid JOIN PROJECTEN ON TOEWIJZINGEN.projectnr=PROJECTEN.projectnr JOIN KLANTEN ON KLANTEN.klantnr=FACTUREN_KLANTEN.klantnr WHERE FACTUREN.factuurid=?"
    connection.query(klantaanpassenquery, [id], (error, factuurklant) => {
        connection.query("SELECT klantnr, voornaam, achternaam FROM KLANTEN", (error, klantlijst) => {
            connection.query("SELECT projectnaam, projectnr FROM PROJECTEN", (error, projectlijst) => { 
                connection.query("SELECT linkURL FROM FACTUUR_LINKS WHERE factuurid=?",[id], (error, bestandlijst) => { 
            res.render(path.join(__dirname, 'views', 'klant_factuur', 'details_aanpassen_klantFactuur.hbs'), {factuurklant: factuurklant[0],projectlijst:projectlijst,klantlijst:klantlijst, bestandlijst:bestandlijst});  
        });
    });
});  
})
});

//nieuwe klantfactuur GET
router.get('/klant_factuur/nieuw_KlantFactuur.html', authenticateToken3, (req, res) => {
    connection.query("SELECT klantnr, voornaam, achternaam FROM KLANTEN", (error, klanten) => {
        if (error) console.log(error);
        if (error) throw error;
        connection.query("SELECT projectnaam, projectnr FROM PROJECTEN", (error, projecten) => {
            if (error) console.log(error);
            if (error) throw error;
        res.render(path.join(__dirname, 'views', 'klant_factuur', 'nieuw_KlantFactuur.hbs'), { klanten: klanten, projecten: projecten });
});
});
});

//upload extra bestand 
router.post('/uploadfilefactklant', upload.array('files'),authenticateToken3, (req, res) => {
    const factuurid = req.body.factuurid;

    const sql = 'INSERT INTO FACTUUR_LINKS (factuurid, linkURL) VALUES (?, ?)';
    const insertFile = (file, callback) => {
        connection.query(sql, [factuurid, file.filename], callback);
    };

    const tasks = req.files.map(file => {
        return new Promise((resolve, reject) => {
            insertFile(file, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });

    Promise.all(tasks)
        .then(results => {
            res.redirect(`./klant_factuur/details_aanpassen_klantFactuur.html?var=${factuurid}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error uploading files');
        });
});

//deletefile
router.get('/deletefilefactklant', authenticateToken3, (req, res) => {
    const file = req.query.file;
    const filePath = path.join(__dirname, 'uploads', file);
    const id = req.query.id;
    connection.query('DELETE FROM FACTUUR_LINKS WHERE linkURL = ?',[file], (error,results) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting file from file system');
            }

            res.redirect(`./klant_factuur/details_aanpassen_klantFactuur.html?var=${id}`);

});
});
});

//update klantfactuur POST
router.post('/klantfactupdate', upload.none(), authenticateToken3, (req, res) => {
   
    const { factuurid, factuurnr, klantnr, projectnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW, betalingsDatum, beschrijving } = req.body;
   const formattedFactuurDatum = new Date(factuurDatum).toISOString().slice(0, 10); // YYYY-MM-DD format
    let formattedDatumBetaling = null;
    if (betalingsDatum && betalingsDatum.length > 0) {
        formattedDatumBetaling = new Date(betalingsDatum).toISOString().slice(0, 10); // YYYY-MM-DD format
    }
    // SQL data toevoegen
    const sqlInsertFacturen = 'UPDATE FACTUREN SET factuurnr=?, factuurDatum=?, BTWperc=?, statusBetaling=?, bedragNoBTW=?, datumBetaling=? WHERE factuurid=?';
    connection.query(sqlInsertFacturen, [factuurnr, formattedFactuurDatum, BTWperc, statusBetaling, bedragNoBTW, formattedDatumBetaling, factuurid], (err) => {
        if (err) return console.log('Error inserting into FACTUREN');
        const sqlInsertFacturenKlanten = 'UPDATE FACTUREN_KLANTEN SET klantnr=?, beschrijving=? WHERE factuurid=?';
        connection.query(sqlInsertFacturenKlanten, [klantnr,beschrijving, factuurid], (err) => {
            if (err) return console.log('Error inserting into FACTUREN_KLANTEN');
        });
        const sqlInsertToewijgingen = 'UPDATE TOEWIJZINGEN  SET projectnr=? WHERE factuurid=?';
        connection.query(sqlInsertToewijgingen, [projectnr, factuurid], (err) => {
            if (err) return console.log('Error inserting into TOEWIJZINGEN');
        });

        res.redirect(`./klant_factuur/details_aanpassen_klantFactuur.html?var=${factuurid}`);

});
});

//nieuwe klantfactuur POST
router.post('/klantFactNieuw', upload.array('pdfFiles'), authenticateToken3, (req, res) => {
    const { factuurnr, klantnr, projectnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW, betalingsDatum } = req.body;
    const formattedFactuurDatum = new Date(factuurDatum).toISOString().slice(0, 10); // YYYY-MM-DD format
    let formattedDatumBetaling = null;
    if (betalingsDatum && betalingsDatum.length > 0) {
        formattedDatumBetaling = new Date(betalingsDatum).toISOString().slice(0, 10); // YYYY-MM-DD format
    }

    // SQL data toevoegen
    const sqlInsertFacturen = 'INSERT INTO FACTUREN (factuurnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW, DatumBetaling) VALUES (?,?,?,?,?,?)';
    connection.query(sqlInsertFacturen, [factuurnr, formattedFactuurDatum, BTWperc, statusBetaling, bedragNoBTW, formattedDatumBetaling], (err, result) => {
        if (err) return res.status(500).send('Error inserting into FACTUREN');
        const lastInsertedId = result.insertId;

        const sqlInsertFacturenKlanten = 'INSERT INTO FACTUREN_KLANTEN (factuurid, klantnr) VALUES (?,?)';
        connection.query(sqlInsertFacturenKlanten, [lastInsertedId, klantnr], (err, result) => {
            if (err) return res.status(500).send('Error inserting into FACTUREN_KLANTEN');
        });

        const sqlInsertToewijgingen = 'INSERT INTO TOEWIJZINGEN (projectnr, factuurid) VALUES (?,?)';
        connection.query(sqlInsertToewijgingen, [projectnr, lastInsertedId], (err, result) => {
            if (err) return res.status(500).send('Error inserting into TOEWIJZINGEN');
        });

        // fileupload doen
        if (!req.files || req.files.length === 0) {
            return res.redirect(`../klant_factuur/details_aanpassen_klantFactuur.html?var=${lastInsertedId}`);
        } else {
            const sql = 'INSERT INTO FACTUUR_LINKS (factuurid, linkURL) VALUES (?, ?)';

            const insertFile = (file, callback) => {
                connection.query(sql, [lastInsertedId, file.filename], callback);
            };

            const tasks = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    insertFile(file, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });

            Promise.all(tasks)
                .then(results => {
                    res.redirect(`./klant_factuur/home_klantFacturen.html`);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error uploading files');
                });
        }
    });
});

//delete klantfactuur geheel
router.get('/deletefactklant', authenticateToken3, (req, res) => {
    const id = req.query.id;

    // Delete uit FACTUREN
    connection.query('DELETE FROM FACTUREN WHERE factuurid = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error deleting entries from the FACTUREN table');
        }

        // Delete uit FACTUREN_KLANTEN
        connection.query('DELETE FROM FACTUREN_KLANTEN WHERE factuurid = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error deleting entries from the FACTUREN_KLANTEN table');
            }

            connection.query('SELECT linkURL FROM FACTUUR_LINKS WHERE factuurid = ?', [id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Error retrieving files from the database');
                }

                if (results.length > 0) {
                    const filePaths = results.map(row => path.join('uploads', row.linkURL));

                    let deleteCount = 0;
                    filePaths.forEach((filePath) => {
                        deleteFile(filePath, (err) => {
                            deleteCount++;
                            if (deleteCount === filePaths.length) {
                                connection.query('DELETE FROM FACTUUR_LINKS WHERE factuurid = ?', [id], (error, results) => {
                                    if (error) {
                                        console.error(error);
                                        return res.status(500).send('Error deleting entries from the FACTUUR_LINKS table');
                                    }

                                    res.redirect(`../klant_factuur/home_klantFacturen.html`);
                                });
                            }
                        });
                    });
                } else {
                    res.redirect(`../klant_factuur/home_klantFacturen.html`);
                }
            });
        });
    });
});




//-------------------LEVERANCIERS FACTUREN-----------------------------------------------------------
router.get('/lev_Factuur/home_fact_lev.html',authenticateToken3, (req, res) => {
    connection.query("SELECT FACTUREN.factuurid, FACTUREN.factuurnr, DATE_FORMAT(FACTUREN.factuurDatum, '%d/%m/%Y') AS factuurDatum, FACTUREN.statusBetaling,FACTUREN.BTWperc , IF(FACTUREN_LEVERANCIERS.verstuurdBoekhouder,'Ja','Nee') AS verstuurdBoekhouder FROM FACTUREN JOIN FACTUREN_LEVERANCIERS ON FACTUREN.factuurid = FACTUREN_LEVERANCIERS.factuurid", (error, results) => {
        if (error) console.log(error);
        if (error) throw error;
        res.render(path.join(__dirname, 'views', 'lev_Factuur', 'home_fact_lev'), { LevFacturen: results });
    });
});
//Levfact aanpassen GET
router.get('/lev_Factuur/fact-lev-aanpassen.html', authenticateToken3, (req, res) => {
    const id = req.query.var;
    let levaanpasquery ="SELECT FACTUREN.factuurid, voorgeschoten, IF(FACTUREN_LEVERANCIERS.terugbetaald,'Ja','Nee') AS terugbetaald,DATE_FORMAT(FACTUREN_LEVERANCIERS.datumTerugbetaling, '%Y-%m-%d') AS datumTerugbetaling , PROJECTEN.projectnr, factuurnr, LEVERANCIERS.naam, DATE_FORMAT(FACTUREN.factuurDatum, '%Y-%m-%d') AS factuurDatum, BTWperc, statusBetaling, projectnaam, bedragNoBTW, DATE_FORMAT(FACTUREN.DatumBetaling, '%Y-%m-%d') AS DatumBetaling, FACTUREN_LEVERANCIERS.levnr, IF(FACTUREN_LEVERANCIERS.verstuurdBoekhouder,'Ja','Nee') AS verstuurdBoekhouder FROM FACTUREN JOIN FACTUREN_LEVERANCIERS ON FACTUREN.factuurid = FACTUREN_LEVERANCIERS.factuurid JOIN TOEWIJZINGEN on FACTUREN.factuurid=TOEWIJZINGEN.factuurid JOIN PROJECTEN ON TOEWIJZINGEN.projectnr=PROJECTEN.projectnr JOIN LEVERANCIERS ON FACTUREN_LEVERANCIERS.levnr=LEVERANCIERS.levnr WHERE FACTUREN.factuurid=?"
    connection.query(levaanpasquery, [id], (error, factuurlev) => {
        connection.query("SELECT klantnr, voornaam, achternaam FROM KLANTEN", (error, levlijst) => {
            connection.query("SELECT projectnaam, projectnr FROM PROJECTEN", (error, projectlijst) => { 
                connection.query("SELECT linkURL FROM FACTUUR_LINKS WHERE factuurid=?",[id], (error, bestandlijst) => { 
                    connection.query("SELECT gebruikersnaam, idnr FROM GEBRUIKERS",[id], (error, gebruikers) => { 
                        const persoon = factuurlev[0].voorgeschoten;
                        connection.query("SELECT gebruikersnaam, idnr FROM GEBRUIKERS WHERE idnr=?",[persoon], (error, voorGebruikers) => { 
            res.render(path.join(__dirname, 'views', 'lev_Factuur', 'fact-lev-aanpassen.hbs'), {factuurlev: factuurlev[0],projectlijst:projectlijst,levlijst:levlijst, bestandlijst:bestandlijst, gebruikers:gebruikers, voorGebruikers:voorGebruikers[0]});  
        });
        });
    });
    });
});  
})
});


//upload extra bestand 
router.post('/uploadfilefactlev', upload.array('files'), (req, res) => {
    const factuurid = req.body.factuurid;

    const sql = 'INSERT INTO FACTUUR_LINKS (factuurid, linkURL) VALUES (?, ?)';
    const insertFile = (file, callback) => {
        connection.query(sql, [factuurid, file.filename], callback);
    };

    const tasks = req.files.map(file => {
        return new Promise((resolve, reject) => {
            insertFile(file, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });

    Promise.all(tasks)
        .then(results => {
            res.redirect(`./lev_Factuur/fact-lev-aanpassen.html?var=${factuurid}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error uploading files');
        });
});


//deletefile
router.get('/deletefilefactlev', authenticateToken3, (req, res) => {
    const file = req.query.file;
    const filePath = path.join(__dirname, 'uploads', file);
    const id = req.query.id;
    connection.query('DELETE FROM FACTUUR_LINKS WHERE linkURL = ?',[file], (error,results) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting file from file system');
            }

            res.redirect(`./lev_Factuur/fact-lev-aanpassen.html?var=${id}`);

});
});
});


//update levfactuur POST
router.post('/levfactupdate', upload.none(), authenticateToken3, (req, res) => {
    const {
        factuurid, factuurnr, levnr, projectnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW,
        betalingsDatum, verstuurdBoekhouder, terugbetaald, datumTerugbetaling, voorgeschoten
    } = req.body;

    const formattedFactuurDatum = new Date(factuurDatum).toISOString().slice(0, 10);
    let formattedDatumBetaling = betalingsDatum ? new Date(betalingsDatum).toISOString().slice(0, 10) : null;
    let formattedDatumTerugbetaling = datumTerugbetaling ? new Date(datumTerugbetaling).toISOString().slice(0, 10) : null;

    const terugbetaaldBool = (terugbetaald === 'Nee') ? 0 : 1;
    const verstuurdBoekhouderBool = (verstuurdBoekhouder === 'Nee') ? 0 : 1;

    let voorgeschotenINT = (voorgeschoten === '') ? null : Number(voorgeschoten);

    const sqlUpdateFacturen = 'UPDATE FACTUREN SET factuurnr=?, factuurDatum=?, BTWperc=?, statusBetaling=?, bedragNoBTW=?, datumBetaling=? WHERE factuurid=?';
    connection.query(sqlUpdateFacturen, [factuurnr, formattedFactuurDatum, BTWperc, statusBetaling, bedragNoBTW, formattedDatumBetaling, factuurid], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating FACTUREN');
        }

        const sqlUpdateFacturenLev = 'UPDATE FACTUREN_LEVERANCIERS SET levnr=?, verstuurdBoekhouder=?, terugbetaald=?, datumTerugbetaling=?, voorgeschoten=? WHERE factuurid=?';
        connection.query(sqlUpdateFacturenLev, [levnr, verstuurdBoekhouderBool, terugbetaaldBool, formattedDatumTerugbetaling, voorgeschotenINT, factuurid], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating FACTUREN_LEVERANCIERS');
            }

            const sqlUpdateToewijgingen = 'UPDATE TOEWIJZINGEN SET projectnr=? WHERE factuurid=?';
            connection.query(sqlUpdateToewijgingen, [projectnr, factuurid], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error updating TOEWIJZINGEN');
                }

                res.redirect(`./lev_Factuur/fact-lev-aanpassen.html?var=${factuurid}`);
            });
        });
    });
});


//Post nieuwe factuur

router.post('/levFactNieuw', upload.array('pdfFiles'), authenticateToken3, (req, res) => {
    const {
        factuurnr, levnr, projectnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW,
        betalingsDatum, verstuurdBoekhouder, terugbetaald, datumTerugbetaling, voorgeschoten
    } = req.body;

    const formattedFactuurDatum = new Date(factuurDatum).toISOString().slice(0, 10);
    let formattedDatumBetaling = betalingsDatum ? new Date(betalingsDatum).toISOString().slice(0, 10) : null;
    let formattedDatumTerugbetaling = datumTerugbetaling ? new Date(datumTerugbetaling).toISOString().slice(0, 10) : null;

    const terugbetaaldBool = (terugbetaald === 'Nee') ? 0 : 1;
    const verstuurdBoekhouderBool = (verstuurdBoekhouder === 'Nee') ? 0 : 1;

    let voorgeschotenINT = (voorgeschoten === '') ? null : Number(voorgeschoten);

    const sqlInsertFacturen = `
        INSERT INTO FACTUREN (factuurnr, factuurDatum, BTWperc, statusBetaling, bedragNoBTW, DatumBetaling) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(sqlInsertFacturen, [factuurnr, formattedFactuurDatum, BTWperc, statusBetaling, bedragNoBTW, formattedDatumBetaling], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error inserting into FACTUREN');
        }
        const lastInsertedId = result.insertId;

        const sqlInsertFacturenKlanten = `
            INSERT INTO FACTUREN_LEVERANCIERS (factuurid, levnr, verstuurdBoekhouder, terugbetaald, datumTerugbetaling, voorgeschoten) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(sqlInsertFacturenKlanten, [lastInsertedId, levnr, verstuurdBoekhouderBool, terugbetaaldBool, formattedDatumTerugbetaling, voorgeschotenINT], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error inserting into FACTUREN_LEVERANCIERS');
            }

            const sqlInsertToewijgingen = `
                INSERT INTO TOEWIJZINGEN (projectnr, factuurid) 
                VALUES (?, ?)
            `;
            connection.query(sqlInsertToewijgingen, [projectnr, lastInsertedId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error inserting into TOEWIJZINGEN');
                }

                if (!req.files || req.files.length === 0) {
                    return res.redirect(`../lev_Factuur/fact-lev-aanpassen.html?var=${lastInsertedId}`);
                } else {
                    const sql = 'INSERT INTO FACTUUR_LINKS (factuurid, linkURL) VALUES (?, ?)';

                    const insertFile = (file, callback) => {
                        connection.query(sql, [lastInsertedId, file.filename], callback);
                    };

                    const tasks = req.files.map(file => {
                        return new Promise((resolve, reject) => {
                            insertFile(file, (err, result) => {
                                if (err) return reject(err);
                                resolve(result);
                            });
                        });
                    });

                    Promise.all(tasks)
                        .then(results => {
                            res.redirect(`../lev_Factuur/fact-lev-aanpassen.html?var=${lastInsertedId}`);
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send('Error uploading files');
                        });
                }
            });
        });
   
    });
});


//nieuwe LEVfact GET
router.get('/lev_Factuur/factuur_lev_toe.html', authenticateToken3, (req, res) => {
    connection.query("SELECT levnr, naam FROM LEVERANCIERS", (error, lev) => {
        if (error) console.log(error);
        if (error) throw error;
        connection.query("SELECT projectnaam, projectnr FROM PROJECTEN", (error, projecten) => {
            if (error) console.log(error);
            if (error) throw error;
            connection.query("SELECT gebruikersnaam, idnr FROM GEBRUIKERS", (error, gebruikers) => { 
        res.render(path.join(__dirname, 'views', 'lev_Factuur', 'factuur_lev_toe.hbs'), { lev: lev, projecten: projecten, gebruikers:gebruikers});
    });
    });
});
});

//delete leveranciersfact geheel
router.get('/deletefactlev', authenticateToken3, (req, res) => {
    const id = req.query.id;

    // Delete uit FACTUREN
    connection.query('DELETE FROM FACTUREN WHERE factuurid = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error deleting entries from the FACTUREN table');
        }

        // Delete uit FACTUREN_LEVERANCIERS
        connection.query('DELETE FROM FACTUREN_LEVERANCIERS WHERE factuurid = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error deleting entries from the FACTUREN_LEVERANCIERS table');
            }

            connection.query('SELECT linkURL FROM FACTUUR_LINKS WHERE factuurid = ?', [id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Error retrieving files from the database');
                }

                if (results.length > 0) {
                    const filePaths = results.map(row => path.join('uploads', row.linkURL));

                    let deleteCount = 0;
                    filePaths.forEach((filePath) => {
                        deleteFile(filePath, (err) => {
                            deleteCount++;
                            if (deleteCount === filePaths.length) {
                                connection.query('DELETE FROM FACTUUR_LINKS WHERE factuurid = ?', [id], (error, results) => {
                                    if (error) {
                                        console.error(error);
                                        return res.status(500).send('Error deleting entries from the FACTUUR_LINKS table');
                                    }

                                    res.redirect(`../lev_Factuur/home_fact_lev.html`);
                                });
                            }
                        });
                    });
                } else {
                    res.redirect(`../lev_Factuur/home_fact_lev.html`);
                }
            });
        });
    });
});


//-------------------routes voor chartpage----------------------
router.get('/chartspage', authenticateToken1,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chartspage.html'));
});

//data leveranciers facturen
router.get('/api/levfacturen', (req, res) => {
    const factuurdatalev = 'SELECT FACTUREN.statusBetaling FROM FACTUREN INNER JOIN FACTUREN_LEVERANCIERS ON FACTUREN.factuurid = FACTUREN_LEVERANCIERS.factuurid' 

    connection.query(factuurdatalev, (err, results) => {
        if (err) throw err;
        res.json(results);
        //console.log(results)
    });
});

//data klanten facturen
router.get('/api/klantfacturen', (req, res) => {
    const factuurdataklanten = 'SELECT FACTUREN.statusBetaling FROM FACTUREN INNER JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid' 

    connection.query(factuurdataklanten, (err, results) => {
        if (err) throw err;
        res.json(results);
       //console.log(results)
    });
});

//omzet klanten/ maand voor dit jaar
router.get('/api/omzet-klanten', (req, res) => {
    connection.query(`
    SELECT 
            MONTH(FACTUREN.factuurDatum) AS month,
            SUM(FACTUREN.bedragNoBTW) AS total
        FROM FACTUREN 
        JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid 
        WHERE YEAR(FACTUREN.factuurDatum) = YEAR(CURDATE())
        GROUP BY month

    `, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
           // console.log('resultaat omzet-klanten/maand van huidig jaar : ',results);
        }
    });
});

//kosten dit jaar per maand 
router.get('/api/kosten', (req, res) => {
    connection.query(`
    SELECT 
            MONTH(FACTUREN.factuurDatum) AS month,
            SUM(FACTUREN.bedragNoBTW) AS total
        FROM FACTUREN 
        JOIN FACTUREN_LEVERANCIERS ON FACTUREN.factuurid = FACTUREN_LEVERANCIERS.factuurid 
        WHERE YEAR(FACTUREN.factuurDatum) = YEAR(CURDATE())
        GROUP BY month

    `,
     (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
            //console.log('resultaat kosten dit jaar/maand van huidig jaar : ',results);
        }
    });
});





module.exports = router;
