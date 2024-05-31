const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file middleware
app.use('/CSS', express.static(__dirname + '/views/CSS'));
app.use('/JS', express.static(__dirname + '/views/JS'));
app.use('/assests/images', express.static(path.join(__dirname, 'assests', 'images')))

// Use handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'hbs');
app.set("views", __dirname + '/views');

//helper function for handlebars - formatdate

/* // Set up Handlebars and register helper function
const hbs = handlebars.create({
  defaultLayout: 'main',
  helpers: {
    formatDate: function(dateValue) {
      let date = new Date(dateValue);
      return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }
  }
}); */



// Exempt favicon.ico from authentication--- DIt kan toch  gewoon in routes zonder een auth middleware of bij static routes?
app.get('/favicon.ico', (req, res) => res.status(204));

// Routes
app.use('/', routes);

/*-------------https:---------------------- please do not touch nor the certifcates folder
const options = {
key: fs.readFileSync((__dirname + '/certificates/privkey.pem')),
cert: fs.readFileSync((__dirname + '/certificates/fullchain.pem'))
};
  
https.createServer(options, app).listen(port, () => {
 console.log('HTTPS server running on port ' + port);
 });


const http = require('http');

http.createServer((req, res) => {
res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url  });
res.end();
}).listen(3000);
*/

//-----------------development server:---------------------- Disable on 
app.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});