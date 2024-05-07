console.log('Hello from nieuwproject!');


const serverUrl = 'http://localhost:3000';

document.getElementById('project_form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        projectnr: document.getElementById('projectnr').value,
        klantnr: document.getElementById('klantnr').value,
        projectnaam: document.getElementById('projectnaam').value,
        status: document.getElementById('status').value,
        straatnaam  : document.getElementById('straatnaam').value,
        huisnr: document.getElementById('huisnr').value,
        gemeente: document.getElementById('gemeente').value,
        postcode: document.getElementById('postcode').value,
        land: document.getElementById('land').value,

    };

    const json = JSON.stringify(formData);
    console.log(formData);

    fetch(`${serverUrl}/submit-form-nieuw-project` ,{
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
