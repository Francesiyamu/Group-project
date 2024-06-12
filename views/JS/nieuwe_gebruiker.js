console.log('Hello from gebruikersscript !');

const serverUrl = 'http://localhost:3000';



document.getElementById('form_gebruiker').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    function treatErrors() {
        let message = "";
        let counter = 1;
        let errorMsgs = document.getElementsByClassName('errorMsg');
    
        for(let error of errorMsgs) {
            message += `${counter}. ${error.textContent}. \n`;
            counter++
        }
    
        console.log(message);
        
        if(message) {
            alert(message);
            window.scrollTo(0,0);
        } 
        
        return message;
    }

    let message;
    const errors = [];
    const gebruikersnaam = document.getElementById('gebruikersnaam').value;
    const wachtwoord = document.getElementById('wachtwoord').value;
    const voornaam = document.getElementById('voornaam').value;
    const achternaam = document.getElementById('achternaam').value;
    const emailadres = document.getElementById('emailadres').value;

    if(!gebruikersnaam) errors.push("Gebruikersnaam is verplicht");
    if(!wachtwoord) errors.push("Wachtwoord is verplicht");
    if(!voornaam) errors.push("Voornaam is verplicht");
    if(!achternaam) errors.push("Achternaam is verplicht");
    if(!emailadres) errors.push("E-mailadres is verplicht");

    if(errors) {
        let div = document.getElementById('errorMsgs');
        div.textContent = '';
        for(let error of errors) {
            let p = document.createElement('p');
            p.appendChild(document.createTextNode(error));
            p.classList.add('errorMsg');
            div.appendChild(p);
        }

        message = treatErrors();
    }

    const formData = {
        //id : document.getElementById('idnr').value,
        functienr : document.getElementById('functie').value,
        gebruikersnaam: document.getElementById('gebruikersnaam').value,
        wachtwoord: document.getElementById('wachtwoord').value,
        voornaam: document.getElementById('voornaam').value,
        achternaam: document.getElementById('achternaam').value,
        emailadres: document.getElementById('emailadres').value
    };

    const json = JSON.stringify(formData);
    
    console.log(formData);

    if(!message) {
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
    }
});
