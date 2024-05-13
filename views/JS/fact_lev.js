
			const form = document.getElementById('uploadform');

			const sendFiles = async() =>{
				//Object

				const myFiles = document.getElementById('fileInput').files

				const formData = new formData()

				Object.keys(myFiles).forEach(key =>{
					formData.append(myFiles.item(key).name, myFiles.item(key))
				})

				const response = await fetch('http://localhost:3000/upload',{
					method :'POST',
					body: formData
				})

				const json = await response.json()

				const h2 = document.querySelectorAll('h2');
				h2.textContent = `Status: ${json?.status}`

				const h3 = document.querySelector('h3')
				h3.textContent =json?.message

				console.log(json)

			}
			//form submission
			form.addEventListener('submit', (e) => {
				e.preventDefault()
				sendFiles()
			})


		









/* for images*/

const files = document.getElementById("files");

const formData = new FormData();
formData.append("fn", fn.value);
formData.append("ln", ln.value);

for (let i=0; i <files.files.length; i++){
    formData.append("files", files.files[i]);
}

console.log(...formData);

fetch('http://localhost:3000/uploads',{
  method: 'POST',
  body: formData,
})

.then(res => res.json())
.then(data => console.log(data));*/
