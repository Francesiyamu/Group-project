
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gebruikersnaam = document.querySelector('#gebruikersnaam').value;
    const wachtwoord = document.querySelector('#wachtwoord').value;
    const result = await loginGebruiker(gebruikersnaam, wachtwoord);
    if(result.status === 'success'){
        window.location.href = '/home_klant'; // na login wordt je naar deze pagina gebracht... 
    } else {
        alert(result.message);
    }
});


const loginGebruiker = async (gebruikersnaam, wachtwoord) => {
    try{
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gebruikersnaam, wachtwoord})
        });
        const result = await response.json();
        return result;
    } catch (error){
        console.error('Error in login gebruiker:', error);
        return {status: 'error', message: 'Internal server error'};
    }
};