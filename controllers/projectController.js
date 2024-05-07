const connection = require('../db_connection');

const registreerNieuwProject = async (req, res) => {
    // Extract data from request body
    const { projectnr, klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land } = req.body;

    // Insert data into MySQL
    const sql = 'INSERT INTO PROJECTEN (projectnr,klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land) VALUES (?,?,?,?,?,?,?,?,?)';
    connection.query(sql, [projectnr, klantnr, projectnaam, status, straatnaam, huisnr, gemeente, postcode, land],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into MySQL:', err);
                res.status(500).json({ status: 'error', message: 'Internal server error' });
                return;
            }
            console.log('Data inserted into MySQL');
            res.status(200).json({ status: 'success', message: 'Data inserted successfully' });
        });
};

module.exports = {registreerNieuwProject};