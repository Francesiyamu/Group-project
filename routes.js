
console.log('Hello from the routes file!');
const express = require('express');
const router = express.Router();
const connection = require('./db_connection');


    // Serve the home page
    router.get('/', (req, res) => {
        res.sendFile(__dirname + '/views/home/index.html');
    });

    // Serve the form page for creating a new project
    router.get('/nieuw-project', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.html');
    });
    router.get('/nieuw_project.css', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.css');
    });
    router.get('/nieuw_project.js', (req, res) => {
        res.sendFile(__dirname + '/views/projecten/nieuw_project.js');
    });
    
    
    // Handle form submission for creating a new project
    router.post('/submit-form', (req, res) => {
        // Extract data from request body
        const { projectnr, klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land } = req.body;

        // Insert data into MySQL
        const sql = 'INSERT INTO PROJECTEN (klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land) VALUES (?,?,?,?,?,?,?,?)';
        connection.query(sql, [ klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land],
            (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err);
                    res.status(500).json({ status: 'error', message: 'Internal server error' });
                    return;
                }
                console.log('Data inserted into MySQL');
                res.status(200).json({ status: 'success', message: 'Data inserted successfully' });
            });
    });


module.exports = router;





