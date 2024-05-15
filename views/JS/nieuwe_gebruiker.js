console.log('Hello from gebruikersscript !');

const serverUrl = 'http://localhost:3000';



document.getElementById('form_gebruiker').addEventListener('submit', async function(e) {
    e.preventDefault();

    
    const formData = {
        funtienr: document.getElementById('functie').value,
        gebruikersnaam: document.getElementById('gebruikersnaam').value,
        wachtwoord: document.getElementById('wachtwoord').value,
        voornaam: document.getElementById('voornaam').value,
        achternaam: document.getElementById('achternaam').value,
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
        window.location.href = "/gebruikers/home_gebruikers.html";
    })
    .catch(error => {
        console.error('Problem with fetching form data:', error);
    });
   
});
