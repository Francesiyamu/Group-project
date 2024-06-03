const { body } = require('express-validator');

// Validator chain leverancier
const validationRulesLev = () => {
    return [
        body('levnaam').notEmpty().withMessage('Leveranciersnaam is verplicht').isString(),
        body('straatnaam').notEmpty().withMessage('Straatnaam is verplicht').isString(),
        body('huisnr').notEmpty().withMessage('Huisnummer is verplicht').isString(),
        body('postcode').notEmpty().withMessage('Postcode is verplicht').isString(),
        body('gemeente').notEmpty().withMessage('Gemeente is verplicht').isString(),
        body('telefoonnr').notEmpty().withMessage('Telefoonnummer is verplicht'),
        body('email').notEmpty().withMessage('E-mailadres is verplicht').isEmail().withMessage('E-mailadres moet geldig zijn'),
        body('BTWnr').notEmpty().withMessage('BTW-nummer is verplicht').isString()
    ];
}

// Validator chain klant
const validationRulesKlant = () => {
    return [
        body('voornaam').notEmpty().withMessage('Voornaam is verplicht').isString(),
        body('achternaam').notEmpty().withMessage('Achternaam is verplicht').isString(),
        body('straatnaam').notEmpty().withMessage('Straatnaam is verplicht').isString(),
        body('huisnr').notEmpty().withMessage('Huisnummer is verplicht').isString(),
        body('postcode').notEmpty().withMessage('Postcode is verplicht').isString(),
        body('gemeente').notEmpty().withMessage('Gemeente is verplicht').isString(),
        body('telefoonnr').notEmpty().withMessage('Telefoonnummer is verplicht'),
        body('email').notEmpty().withMessage('E-mailadres is verplicht').isEmail().withMessage('E-mailadres moet geldig zijn'),
        //body('BTWnr').notEmpty().withMessage('BTW-nummer is verplicht').isString()
    ];
}

// Validator chain project
const validationRulesProject = () => {
    return [
        body('projectnaam').notEmpty().withMessage('Projectnaam is verplicht').isString(),
        body('straatnaam').notEmpty().withMessage('Straatnaam is verplicht').isString(),
        body('huisnr').notEmpty().withMessage('Huisnummer is verplicht').isString(),
        body('postcode').notEmpty().withMessage('Postcode is verplicht').isString(),
        body('gemeente').notEmpty().withMessage('Gemeente is verplicht').isString(),
        //body('BTWnr').notEmpty().withMessage('BTW-nummer is verplicht').isString()
    ];
}

//Validator chain gebruiker
const validationRulesGebruiker = () => {
    return [
        body('gebruikersnaam').notEmpty().withMessage('Gebruikersnaam is verplicht').isString(),
        body('wachtwoord').notEmpty().withMessage('Wachtwoord is verplicht').isString(),
        body('voornaam').notEmpty().withMessage('Voornaam is verplicht').isString(),
        body('achternaam').notEmpty().withMessage('Achternaam is verplicht').isString(),
        body('emailadres').notEmpty().withMessage('E-mailadres is verplicht').isEmail().withMessage('E-mailadres moet geldig zijn')
    ];
}

module.exports = {validationRulesLev, validationRulesKlant, validationRulesProject, validationRulesGebruiker};