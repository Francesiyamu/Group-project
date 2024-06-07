'use strict'

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







// let window = 'http://127.0.0.1:5501/views/klant_factuur/details_aanpassen_klantFactuur.html'

// window.onload = () => {



let bestand = document.getElementById('addFile')
let i = 0

console.log(bestand)
bestand.onchange = () => {

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
        i++
        let aDeleteFile = document.createElement('a')
        aDeleteFile.type = 'button'
        aDeleteFile.id = `deleteFile`
        aDeleteFile.className = 'file_A_Tag deleteFileClass'
        // let classListA = aDeleteFile.classList
        // classListA.add('file_A_Tag') 
        // classListA.add('deleteFileClass')
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


        // console.log(input)
        // let a = document.getElementsByTagName('a')
        // console.log(a)
        //divFileBox.onclick = deleteBestand

        }
   displayBestand()


}



function deleteBestand(e) {

        let test = e.target.parantElement
        console.log(test)


        // e.target.removeParant()

        console.log('onclick werkt')
        let divBestandenLijst = document.getElementById('bestandenLijst')

        // let div = document.getElementById(`deleteFile ${displayBestand}`)
        // console.log(e.target.classList.contains('deleteFileClass'))

        // console.log('hallo')
        // // if(e.target.classList.contains('deleteFileClass')){
        //         console.log('dit werkt')
        //         let div = e.target.parantElement
        //         console.log('mqlkfjmqslkjfmlqskj')
        //         divBestandenLijst.remove(div)
        // // }



        

        //if(e.target.classList.contains('deleteItem')){
            //if(confirm('Zeker dat je dit item uit je boodschappenlijstje wilt verwijderen?')){
        //     let aDeleteFile = e.target.document.getElementById('file_box')     
        //     let div = e.target.parantElement
        //         // console.log('slmfjqmsdk')
        //         // console.log(div)
        //         div.remove()
        //     //}
        //     console.log('item deleted')
      
}

// let fileBox = document.getElementById('deleteFile')
// console.log(fileBox)
// if(fileBox){
//         fileBox.addEventListener('click', bestand.onchange())
//         console.log('addeventlistener')

// }
// let aDeleteFile = document.getElementById('deleteFile')
// console.log(aDeleteFile)
// aDeleteFile.onclick = () => {
//         deleteBestand()

// }
// window.onchange = () => {

      
// }


