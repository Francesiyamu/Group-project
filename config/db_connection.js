const mysql = require('mysql2');

// Create MySQL connection
const db_config = {
    host: '10.0.1.50',
    user: 'Developer',
    password: 'RADEPIREMENT',
    database: 'Datafact'
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
