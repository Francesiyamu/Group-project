const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const routes = require('./routes');
const session = require('express-session');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret  : 'secret', // session secret
    resave: false, // save session on every request
    saveUninitialized: false,   // don't create session until something stored
}));

app.use('/',routes);





// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

