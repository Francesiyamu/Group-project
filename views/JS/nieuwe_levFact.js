document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const formlevFactuur = document.getElementById('form_levFactuur');
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




    formlevFactuur.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('factuurnr', document.getElementById('factuurnr').value);
        formData.append('factuurDatum', document.getElementById('factuurDatum').value);
        formData.append('projectnr', document.getElementById('projectnr').value);
        formData.append('levnr', document.getElementById('levnr').value);
        formData.append('bedragNoBTW', document.getElementById('bedragNoBTW').value);
        formData.append('BTWperc', document.getElementById('BTWperc').value);
        formData.append('statusBetaling', document.getElementById('statusBetaling').value);
        formData.append('betalingsDatum', document.getElementById('betalingsDatum').value);
        formData.append('verstuurdBoekhouder', document.getElementById('verstuurdBoekhouder').value);
        formData.append('terugbetaald', document.getElementById('terugbetaald').value);
        formData.append('datumTerugbetaling', document.getElementById('datumTerugbetaling').value);
        formData.append('voorgeschoten', document.getElementById('voorgeschoten').value);

        // Append files to formData
        selectedFiles.forEach(file => {
            formData.append('pdfFiles', file);
        });

        try {
            const response = await fetch('/levFactNieuw', {
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
    });
});
