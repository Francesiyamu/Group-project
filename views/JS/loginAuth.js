// Function to handle login form submission
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gebruikersnaam = document.querySelector('#gebruikersnaam').value;
    const wachtwoord = document.querySelector('#wachtwoord').value;
    
    // Attempt to log in the user
    const loginResult = await loginUser(gebruikersnaam, wachtwoord);
    if (loginResult.status === 'success') {
        // If login is successful, store the access token and redirect to home page
        localStorage.setItem('access_token', loginResult.access_token);
        window.location.href = '/home_klantFacturen';
    } else {
        // If login fails, show an alert with the error message
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
        console.log('Login result:', result);
        console.log('Access token:', result.access_token);
        return result;
    } catch (error) {
        console.error('Error in login gebruiker:', error);
        return { status: 'error', message: 'Internal server error' };
    }
};
