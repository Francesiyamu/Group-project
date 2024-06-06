// function showName1(){
//         let bestand = document.getElementById('addFile1')
//         let fileName = bestand.files.item(0).name
//         document.getElementById('file1').textContent = fileName
// }


// function showName2(){
//         let bestand = document.getElementById('addFile2')
//         let fileName = bestand.files.item(0).name
//         document.getElementById('file2').textContent = fileName
// }

// function showName3(){
//         let bestand = document.getElementById('addFile3')
//         let fileName = bestand.files.item(0).name
//         document.getElementById('file3').textContent = fileName
// }



// function deleteName1(){
//         document.getElementById('file1').textContent = 'Voeg een factuur toe'
// }

// function deleteName2(){
//         document.getElementById('file2').textContent = 'Voeg een factuur toe'
// }

// function deleteName3(){
//         document.getElementById('file3').textContent = 'Voeg een factuur toe'
// }





{/* <a type="button" id="deleteFile1" class="file_A_Tag" onclick="deleteName1()" hidden>
<i class="fa fa-minus-circle" style= "color:red;font-size:20px;text-decoration: none;" hidden></i>
</a>

<a href="../../assests/WE - HC1 Overzicht & HTML basis.pdf" id= "file1" target="iframeFactuur">BESTANDSNAAM VAN INGEVOEGDE FACTUUR</a>   */}






let bestand = document.getElementById('addFile')

console.log(bestand)


let displayBestand = () => {
        let bestand = document.getElementById('addFile')
        let fileName = bestand.files.item(0).name
        let fileUrl = '../../assests/'
        fileUrl += fileName
        let divBestandenLijst = document.getElementById('bestandenLijst')
        console.log('dit werkt')

        let input = document.getElementsByTagName('input')
      
//Maak div aan
let divFileBox = document.createElement('div')
divFileBox.id = 'file_box'
divFileBox.className = 'fileBoxen'

//Maak a element aan
let aDeleteFile = document.createElement('a')
aDeleteFile.type = 'button'
aDeleteFile.id = "deleteFile"
let classListA = aDeleteFile.classList
classListA.add('file_A_Tag') 
classListA.add('deleteFileClass')
//aDeleteFile.className = "file_A_Tag"
aDeleteFile.onclick = deleteBestand
//aDeleteFile.hidden = 'true'

//Maak i element aan
let iDeleteFile = document.createElement('i')
let classListI = iDeleteFile.classList
classListI.add('fa') 
classListI.add('fa-minus-circle')
//iDeleteFile.hidden = 'true'

//Maak a element aan voor display bestand
let aDisplayFile = document.createElement('a')
aDisplayFile.id = 'file'

aDisplayFile.href = fileUrl
aDisplayFile.target = 'iframeFactuur'
aDisplayFile.textContent = fileName


divBestandenLijst.appendChild(divFileBox)
divFileBox.appendChild(aDeleteFile)
divFileBox.appendChild(aDisplayFile)
aDeleteFile.appendChild(iDeleteFile)


console.log(input)
let a = document.getElementsByTagName('a')
console.log(a)
//divFileBox.onclick = deleteBestand
}






let deleteBestand = (e) => {
console.log('onclick werkt')
let divBestandenLijst = document.getElementById('bestandenLijst')
if(e.target.className == 'deleteFileClass'){
let div = e.target.childElement
divBestandenLijst.remove(div)}
}
