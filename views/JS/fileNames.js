function showName1(){
        let bestand = document.getElementById('addFile1')
        let fileName = bestand.files.item(0).name
        document.getElementById('file1').textContent = fileName
}


function showName2(){
        let bestand = document.getElementById('addFile2')
        let fileName = bestand.files.item(0).name
        document.getElementById('file2').textContent = fileName
}

function showName3(){
        let bestand = document.getElementById('addFile3')
        let fileName = bestand.files.item(0).name
        document.getElementById('file3').textContent = fileName
}



function deleteName1(){
        document.getElementById('file1').textContent = 'Voeg een factuur toe'
}

function deleteName2(){
        document.getElementById('file2').textContent = 'Voeg een factuur toe'
}

function deleteName3(){
        document.getElementById('file3').textContent = 'Voeg een factuur toe'
}