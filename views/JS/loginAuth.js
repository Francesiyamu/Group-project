document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const gebruikersnaam = document.querySelector('#gebruikersnaam').value;
            const wachtwoord = document.querySelector('#wachtwoord').value;
            console.log('Gebruikersnaam:', gebruikersnaam);
            const result = await loginGebruiker(gebruikersnaam, wachtwoord);
            if (result.status === 'success') {
                const accessToken = result.accessToken;    
                const level = result.level;               
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('level', level );
                window.location.href = `/set-token?token=${accessToken}&level=${level}`;
            } else {
                alert(result.message);
            }
        });
    }
});

const loginGebruiker = async (gebruikersnaam, wachtwoord) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gebruikersnaam, wachtwoord })
                   
        });
        const result = await response.json();
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error in login gebruiker:', error);
        return { status: 'error', message: 'Internal server error' };
    }
};

