const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
// Set up MySQL connection
const connection = mysql.createConnection({
  host: '10.0.1.50',
  user: 'User',
  password: 'ubarsontryok',
  database: 'Datafact'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});


// Home route to fetch and display all data
app.get('/Facturenklanten', (req, res) => {
    connection.query('SELECT FACTUREN.factuurid, factuurnr, statusBetaling FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid', (error, results, fields) => {
      if (error) throw error;
  
      let html = '<h1>Facturen aan klanten</h1><table border="1"><tr>';
      for (let field of fields) {
        html += `<th>${field.name}</th>`;
      }
      html += '</tr>';
  
      for (let row of results) {
        html += `<tr onclick="window.location='/details?id=${row.factuurid}'" style="cursor:pointer;">`;
        for (let field of fields) {
          html += `<td>${row[field.name]}</td>`;
        }
        html += '</tr>';
      }
  
      html += '</table>';
  
      res.send(html);
    });
  });
  
  // Details route to fetch and display detailed information about a row
  app.get('/details', (req, res) => {
    const id = req.query.id;
    connection.query('SELECT * FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid WHERE FACTUREN.factuurid = ?', [id], (error, results) => {
      if (error) throw error;
  
      let html = '<h1>Detail Page</h1><table border="1">';
      if (results.length > 0) {
        let row = results[0];
        for (let key in row) {
          html += `<tr><th>${key}</th><td>${row[key]}</td></tr>`;
        }
      }
      html += '</table><a href="/Facturenklanten">Back to list</a>';
  
      res.send(html);
    });
  });
  

// Route to display HTML form
app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/Server/index.html');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  const { factuurnr, factuurDatum, bedragNoBTW, BTWperc, statusBetaling, datumBetaling } = req.body;
  const query = `INSERT INTO FACTUREN (factuurnr, factuurDatum, bedragNoBTW, BTWperc, statusBetaling, datumBetaling) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(query, [factuurnr, factuurDatum, bedragNoBTW, BTWperc, statusBetaling, datumBetaling], (err, results) => {
    if (err) throw err;
    res.send('Data inserted successfully!');
  });
});


  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });