
console.log('Hello from gebruikersscript !');


const serverUrl = 'http://localhost:3000';

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        id : document.getElementById('idnr').value,
        gebruikersnaam: document.getElementById('gebruikersnaam').value,
        wachtwoord: document.getElementById('wachtwoord').value,
        voornaam: document.getElementById('voornaam').value,
        achternaam: document.getElementById('achternaam').value,
        straat: document.getElementById('gebrstraat').value,
        huisnummer: document.getElementById('gebrhuisnr').value,
        postcode: document.getElementById('gebrpostcode').value,
        gemeente: document.getElementById('gebrgemeente').value,
        land : document.getElementById('gebrland').value,
        telefoonnummer: document.getElementById('gebrtelefoon').value,
        emailadres: document.getElementById('emailadres').value,
      

    };

    const json = JSON.stringify(formData);
    console.log(formData);

    fetch('/submit-form-nieuwe-gebruiker' ,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data sent:', data);
    })
    .catch(error => {
        console.error('Problem with fetching form data:', error);
    });
});