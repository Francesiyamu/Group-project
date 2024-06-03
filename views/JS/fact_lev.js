
document.addEventListener('DOMContentLoaded', () => {
	const fileInput = document.getElementById('fileInput');
	const fileList = document.getElementById('fileList');

	// // Trigger file input when the file section is clicked
	// document.getElementById('uploadform').addEventListener('click', () => {
	// 		fileInput.click();
	// });

	// Handle file selection
	fileInput.addEventListener('change', (event) => {
			const files = event.target.files;

			// Process each selected file
			for (let file of files) {
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
					});

					fileItem.appendChild(fileName);
					fileItem.appendChild(deleteIcon);
					fileList.appendChild(fileItem);

					// Auto-upload the file
					uploadFile(file);
			}

			// Clear the file input
			fileInput.value = '';
	});

	function uploadFile(file) {
			const formData = new FormData();
			formData.append('file', file);

			fetch('/upload', {
					method: 'POST',
					body: formData,
			})
			.then(response => response.json())
			.then(data => {
					console.log('File uploaded successfully:', data);
			})
			.catch(error => {
					console.error('Error uploading file:', error);
			});
	}
});
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			/*document.querySelector('.file-text').addEventListener('click', function() {
					document.getElementById('fileInput').click();
			});

			document.getElementById('fileInput').addEventListener('change', function(event) {
					const files = event.target.files;
					const uploadedFilesContainer = document.getElementById('uploadedFiles');

					for (let i = 0; i < files.length; i++) {
							const file = files[i];
							const fileElement = document.createElement('div');
							fileElement.classList.add('uploaded-file');

							const fileName = document.createElement('span');
							fileName.textContent = file.name;

							const deleteButton = document.createElement('button');
							deleteButton.textContent = 'Delete';
							deleteButton.addEventListener('click', function() {
									fileElement.remove();
							});

							fileElement.appendChild(fileName);
							fileElement.appendChild(deleteButton);
							uploadedFilesContainer.appendChild(fileElement);
					}
			});
	*/













