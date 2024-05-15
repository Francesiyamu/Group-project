
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
    host: '10.0.1.50', //  IP address
    user: 'Developer',
    password: 'RADEPIREMENT',
    database: 'Datafact'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        
    }
    console.log('Connected to MySQL');
});

module.exports = connection;