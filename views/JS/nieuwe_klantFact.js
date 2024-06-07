const serverUrl = 'http://localhost:3000';


document.getElementById('form_klantFactuur').addEventListener('submit', async function(e) {
    e.preventDefault();

		
				//Object

				//const myFiles = document.getElementById('fileInput').files

				const formData = {

                factuurnr : document.getElementById('factuurnr').value,
                factuurDatum: document.getElementById('factuurDatum').value,
                projectnaam: document.getElementById('projectnaam').value,
                klantnaam: document.getElementById('klantnaam').value,
                totaalBedrag: document.getElementById('totaalBedrag').value,
                BTW: document.getElementById('BTW').value,
                BTW_bedrag: document.getElementById('BTW_bedrag').value,
                status: document.getElementById('status').value,
                betalingsDatum: document.getElementById('betalingsDatum').value,
                beschrijving: document.getElementById('beschrijving').value,
                fileInput: document.getElementById('fileInput').value}
                
				// Object.keys(myFiles).forEach(key =>{
				// 	formData.append(myFiles.item(key).name, myFiles.item(key))
				// })

				const response = await fetch('/klantFactNieuw',{
					method :'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
				})  .then(response => {
                    if(!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data sent:', data);
                    window.location.href = "../klant_factuur/home_klantFacturen.html";
                })
                .catch(error => {
                    console.error('Problem with fetching form data:', error);
                });
            })

			// 	const json = await response.json()

			// 	const h2 = document.querySelectorAll('h2');
			// 	h2.textContent = `Status: ${json?.status}`

			// 	const h3 = document.querySelector('h3')
			// 	h3.textContent =json?.message

			// 	console.log(json)

			// }
			// //form submission
			// form.addEventListener('submit', (e) => {
			// 	e.preventDefault()
			// 	sendFiles()
			// })