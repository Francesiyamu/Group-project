const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file middleware
app.use('/CSS', express.static(__dirname + '/views/CSS'));
app.use('/JS', express.static(__dirname + '/views/JS'));
app.use('/assests/images', express.static('assests/images'))


// Routes
app.use('/', routes);

// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
