document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const formKlantFactuur = document.getElementById('form_klantFactuur');
    let selectedFiles = [];

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;

        for (let file of files) {
            selectedFiles.push(file);
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const fileName = document.createElement('span');
            fileName.classList.add('file-name');
            fileName.textContent = file.name;

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.textContent = '✖';
            deleteIcon.addEventListener('click', () => {
                fileList.removeChild(fileItem);
                selectedFiles = selectedFiles.filter(f => f !== file);
            });

            fileItem.appendChild(fileName);
            fileItem.appendChild(deleteIcon);
            fileList.appendChild(fileItem);
        }

        fileInput.value = '';
    });

    formKlantFactuur.addEventListener('submit', async function(e) {
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
        const factuurnr = document.getElementById('factuurnr').value;
        const factuurDatum = document.getElementById('factuurDatum').value;
        const projectnr = document.getElementById('projectnr').value;
        const klantnr = document.getElementById('klantnr').value;
        const bedragNoBTW = document.getElementById('bedragNoBTW').value;

        if(!factuurnr) errors.push("Factuurnummer is verplicht");
        if(!factuurDatum) errors.push("Factuurdatum is verplicht");
        if(!projectnr) errors.push("Project is verplicht");
        if(!klantnr) errors.push("Klant is verplicht");
        if(!bedragNoBTW) errors.push("Bedrag excl. BTW is verplicht");

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

        const formData = new FormData();
        formData.append('factuurnr', document.getElementById('factuurnr').value);
        formData.append('factuurDatum', document.getElementById('factuurDatum').value);
        formData.append('projectnr', document.getElementById('projectnr').value);
        formData.append('klantnr', document.getElementById('klantnr').value);
        formData.append('bedragNoBTW', document.getElementById('bedragNoBTW').value);
        formData.append('BTWperc', document.getElementById('BTWperc').value);
        formData.append('statusBetaling', document.getElementById('statusBetaling').value);
        formData.append('betalingsDatum', document.getElementById('betalingsDatum').value);
        formData.append('beschrijving', document.getElementById('beschrijving').value);

        // Append files to formData
        selectedFiles.forEach(file => {
            formData.append('pdfFiles', file);
        });

        if(!message) {
            try {
                const response = await fetch('/klantFactNieuw', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    const data = await response.json();
                    console.log('Data sent:', data);
                }
            } catch (error) {
                console.error('Problem with fetching form data:', error);
            }
        }
    });
});
