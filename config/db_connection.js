const mysql = require('mysql2');
require('dotenv').config();
//console.log(process.env);

// Create MySQL connection
const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); 

  connection.connect(function(err) {              
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    } else {
      console.log('connected to db');
    }                                    
  });                                   
                                         
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                        
    } else {                                     
      throw err;                                 
    }
  });
}

handleDisconnect();

module.exports = connection;
