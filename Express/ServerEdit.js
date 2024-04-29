const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 3000;

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }


});

const upload = multer({ storage: storage });



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
        html += `<tr onclick="window.location='/details?id=${row.factuurid}'">`;
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
    let html = '<h1>Detail Page</h1><table border="1">';
    const id = req.query.id;
    connection.query('SELECT * FROM FACTUREN JOIN FACTUREN_KLANTEN ON FACTUREN.factuurid = FACTUREN_KLANTEN.factuurid WHERE FACTUREN.factuurid = ?', [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        let row = results[0];
        for (let key in row) {
          html += `<tr><th>${key}</th><td>${row[key]}</td></tr>`;
        }
      }
      html += '</table>';
    });
      const id2 = req.query.id;
      connection.query('SELECT * FROM FACTUUR_LINKS WHERE FACTUUR_LINKS.factuurid = ?', [id], (error, results,fields) => {
        if (error) throw error;
        html += '<h1>Bestanden</h1><table border="1"><tr>';
        for (let field of fields) {
          html += `<th>${field.name}</th>`;
        }
        html += '</tr>';
        for (let row of results) {
           html += `<tr onclick="window.location='/${row.linkURL}'";>`;
           for (let field of fields) {
            html += `<td>${row[field.name]}</td>`;
          }
          }
          html += '</tr>';
        html += '</table><a href="/Facturenklanten">Back to list</a>';
      res.send(html);
    })
  });
  

// Route to display HTML form
app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/Server/edit.html');
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

// Route to serve upload page
app.get('/fileupload/', (req, res) => {
  res.sendFile(__dirname + '/server/fileupload.html');
});


// Route to handle upload submission
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
      return res.send('Please upload a file');
  }
  const sql = 'INSERT INTO FACTUUR_LINKS (factuurid,linkURL) VALUES (?,?)';
  connection.query(sql, [4,req.file.filename], (err, result) => {
      if (err) throw err;
  })

  res.send('File uploaded successfully and added to Database');
});

app.use(express.static('uploads'));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });