window.onload = () => {
console.log('loaded');
window.scrollTo(0,0);

/* ----------------------------------- ADAPT VISIBILITY ----------------------------------- */

let no_boekhouder_items = document.getElementsByClassName('no_boekhouder');
let level = localStorage.getItem('level');

console.log(level);
if(level == 3) {
    for(let no_boekhouder_item of no_boekhouder_items) {
        no_boekhouder_item.style.display = "none";
    }

    let backbtn = document.querySelector('#form_levFactuur #btn_back');
    if(backbtn) {
        backbtn.style.marginRight = '1rem';
        backbtn.style.marginBottom = '1rem';
    }
}

/* ----------------------------------- SWITCH DETAILS - AANPASSEN ----------------------------------- */

function replaceClasses() {
    let hidden_elements = Array.from(document.getElementsByClassName('hidden'));
    let visible_elements = Array.from(document.getElementsByClassName('visible'));

    for(let element of hidden_elements) {
        element.classList.replace('hidden','visible');
    }

    for(let element of visible_elements) {
        element.classList.replace('visible','hidden');
    }

    let ATags = Array.from(document.getElementsByClassName('file_A_Tag'));
    for(let ATag of ATags) {
        ATag.toggleAttribute('hidden');
    }
}

function toggleAttributes() {
    let inputs = document.getElementsByTagName('input');
    for(let input of inputs) {
        input.toggleAttribute('disabled');
    }

    let selects = document.getElementsByTagName('select');
    for(let select of selects) {
        select.toggleAttribute('disabled');
    }

    let textareas = document.getElementsByTagName('textarea');
    for(let textarea of textareas) {
        textarea.toggleAttribute('disabled');
    }

    let label = document.getElementById('fileSelect');
    if(label) {
        label.toggleAttribute('hidden');
    }

    let iTags = document.getElementsByTagName('i');
    for(let iTag of iTags) {
        iTag.toggleAttribute('hidden');
    }

    let fileInput = document.getElementById('fileInput');
    if(fileInput) {
        fileInput.toggleAttribute('disabled');
    }

}

function switchToModify() {
    replaceClasses();
    document.title = document.getElementById('titel').textContent
    toggleAttributes();
    window.scrollTo(0,0); // https://css-tricks.com/need-to-scroll-to-the-top-of-the-page/#:~:text=You%20might%20need%20to%20trigger,element)%20back%20to%20the%20top.
    inputs.style.alignItems = 'initial';
}


let inputs = Array.from(document.getElementsByClassName('inputs'))[0];
inputs.style.alignItems = 'center';

let btn_modify = document.getElementById('btn_modify');
btn_modify.addEventListener('click', function() {
    event.preventDefault();
    switchToModify();
});

let cancelbtn = document.getElementById('cancelbtn');
cancelbtn.addEventListener('click', function(event){
    event.preventDefault();
    console.log("click")

    const url = new URL(window.location.href); // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/delete
    const searchParams = new URLSearchParams(url.search);
    searchParams.delete("errorsSubmission");
    url.search = searchParams.toString();
    console.log(url);
    window.location.href = url.toString();

    //location.reload();
});

/* ----------------------------------- TREAT ERROR MESSAGES ----------------------------------- */

let message = "";
let counter = 1;
let errorMsgs = document.getElementsByClassName('errorMsg');

for(let error of errorMsgs) {
    message += `${counter}. ${error.textContent}. \n`;
    counter++
}

console.log(message);

if(message) {
    switchToModify();
    setTimeout(() => {alert(message)},100); //Nodig want GET method rendert naar details_aanpassen_xx --> je bent weer op details pagina
}

    const fileInput = document.getElementById('addFile');
    const factuurid = document.getElementById('factuurid');
fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        formData.append('factuurid', factuurid.value);

        try {
            const response = await fetch('/uploadfilefactlev', {
                method: 'POST',
                body: formData
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json();
                console.log('Data sent:', data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });


    let submitbtn = document.getElementById('submitbtn');
    submitbtn.addEventListener('click',async function(event){
        event.preventDefault();
        console.log("click")
        const formData = new FormData();
        formData.append('factuurid', document.getElementById('factuurid').value);
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
        
        try {
            const response = await fetch('/levfactupdate', {
                method: 'POST',
                body: formData
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json();
                console.log('Data sent:', data);
            }
        } catch (error) {
            console.error('Error updating:', error);
        }
    });

    function changeLinkTargets() {
        const links = document.querySelectorAll('#bestandenLijst a');
        if (window.innerWidth < 600) {
            links.forEach(link => {
                link.setAttribute('target', '_blank');
            });
        } else {
            links.forEach(link => {
                link.setAttribute('target', 'iframeFactuur');
            });
        }
    }

    changeLinkTargets();

    window.addEventListener('resize', changeLinkTargets);

}
