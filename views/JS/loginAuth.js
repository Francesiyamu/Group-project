// Function to handle login form submission
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gebruikersnaam = document.querySelector('#gebruikersnaam').value;
    const wachtwoord = document.querySelector('#wachtwoord').value;
    const loginResult = await loginUser(gebruikersnaam, wachtwoord);
    if (loginResult.status === 'success') {
        // If login is successful, store the access token and redirect to home page
        console.log(`login successful, the access token is ${loginResult.access_token}`);
        localStorage.setItem('access_token', loginResult.access_token);
        const headers = {
            'Authorization': `Bearer ${loginResult.access_token}`,
            'Content-Type': 'application/json'
        }
        console.log('headers:', headers);
        window.location.href = '../views/klant_factuur/home_klantFacturen.html';
    } else {
        console.log('login failed:', loginResult.message);
        alert(loginResult.message);
    }
});

// Function to handle user login
const loginUser = async (gebruikersnaam, wachtwoord) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gebruikersnaam, wachtwoord })
        });
        const result = await response.json();
        console.log('login result:', result);
        return result;
        
    } catch (error) {
        console.error('Error in login gebruiker:', error);
        return { status: 'error', message: 'Internal server error' };
    }
};

