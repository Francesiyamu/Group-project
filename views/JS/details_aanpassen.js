window.onload = () => {
console.log('loaded');
window.scrollTo(0,0);

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

/*function switchToDetails() {
    replaceClasses();
    document.title = 'Details'
    toggleAttributes();
    window.scrollTo(0,0);
    inputs.style.alignItems = 'center';
} */

let inputs = Array.from(document.getElementsByClassName('inputs'))[0];
inputs.style.alignItems = 'center';

let btn_modify = document.getElementById('btn_modify');
btn_modify.addEventListener('click', function() {
    event.preventDefault();
    switchToModify();
});

let cancelbtn = document.getElementById('cancelbtn');
cancelbtn.addEventListener('click', function(){
    event.preventDefault();
    location.reload();
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
    setTimeout(() => {alert(message)},5); //Nodig want GET method rendert naar details_aanpassen_xx --> je bent weer op details pagina
}

}