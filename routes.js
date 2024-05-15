const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('./config/db_connection');
const { registreerNieuwProject } = require('./controllers/projectController');
const { registreerGebruiker } = require('./controllers/registerController');
const { userLogin } = require('./controllers/authController');
const authenticateToken = require('./middleware/authenticateToken');




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
router.get('/home_gebruikers', (req, res) => {
    connection.query('SELECT gebruikersnaam, functienr, voornaam, achternaam ,emailadres FROM GEBRUIKERS', (error, results, fields) => {
        if (error) throw error;

        let html = '<table border="1" width=80% align=center><tr>';
        for (let field of fields) {
            html += `<th>${field.name}</th>`;
        }
        html += '</tr>';
        for (let row of results) {
            html += `<tr onclick="window.location='/details_aanpassen_gebruiker?var=${row.gebruikersnaam}'">`;
            for (let field of fields) {
                html += `<td>${row[field.name]}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        res.render(path.join(__dirname, 'views', 'gebruikers', 'home_gebruikers'), { gebruikerslijst: html });
    });
});
router.get('/nieuwe_gebruiker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gebruikers', 'nieuwe_gebruiker.html'));
});
router.get('/details_aanpassen_gebruiker', (req, res) => {
    const id = req.query.var;
    connection.query('SELECT gebruikersnaam, GEBRUIKERS.functienr, voornaam, achternaam ,emailadres, functienaam FROM GEBRUIKERS JOIN FUNCTIES ON GEBRUIKERS.functienr = FUNCTIES.functienr WHERE GEBRUIKERS.gebruikersnaam = ?', [id], (error, results) => {
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

//gebruikers aanpassen
router.post('/submit-form-aanpassen-gebruiker', (req, res) => {
    const { gebruikersnaam, functienummer, voornaam, achternaam, emailadres, wachtwoord} = req.body;
    console.log (gebruikersnaam, functienummer, voornaam, achternaam, emailadres, wachtwoord);
    const query = `UPDATE GEBRUIKERS SET gebruikersnaam = ?, functienummer = ?, voornaam = ?, achternaam = ?, emailadres = ?  , wachtwoord = ?
    WHERE gebruikersnaam = ?`;
    connection.query(query, [gebruikersnaam, functienummer, voornaam, achternaam, emailadres, wachtwoord], (err, results) => {
        if (err) throw err;
        res.send('Data inserted successfully!');
    });
});
// Handle login
router.post('/login', userLogin);


module.exports = router;
