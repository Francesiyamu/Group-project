const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const path = require('path');


const app = express();
const port = 3000;

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


// Exempt favicon.ico from authentication
app.get('/favicon.ico', (req, res) => res.status(204));

// Routes
app.use('/', routes);



// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
