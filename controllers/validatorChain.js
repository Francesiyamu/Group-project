const { body } = require('express-validator');

const countryCodes3 = [
    "AFG", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW",
    "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU",
    "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI",
    "CPV", "KHM", "CMR", "CAN", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL",
    "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK",
    "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "SWZ", "ETH", "FLK",
    "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA",
    "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI",
    "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN",
    "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "KWT",
    "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MDG",
    "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM",
    "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD",
    "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW",
    "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "MKD",
    "ROU", "RUS", "RWA", "REU", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM",
    "SMR", "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB",
    "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWE", "CHE", "SYR",
    "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "TKM",
    "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "URY", "UZB", "VUT", "VEN", "VNM",
    "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE"
  ];



// Validator chain
const validationRulesLev = () => {
    return [
        body('levnaam').notEmpty().withMessage('Leveranciersnaam is required').isString(),
        body('straatnaam').notEmpty().withMessage('Straatnaam is required').isString(),
        body('huisnr').notEmpty().withMessage('Huisnummer is required').isString(),
        body('postcode').notEmpty().withMessage('Postcode is required').isString(),
        body('gemeente').notEmpty().withMessage('Gemeente is required').isString(),
        body('telefoonnr').notEmpty().withMessage('Telefoonnummer is required').withMessage('Telefoonnumber must be enterd'),
        body('email').notEmpty().withMessage('E-mailadres is required').isEmail().withMessage('Must be a valid E-mailadres'),
        body('BTWnr').notEmpty().withMessage('BTW-nummer is required').isString()
    ];
}

module.exports = {validationRulesLev};