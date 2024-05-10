window.onload = () => {
console.log('loaded');

// hidden bij details weg, toevoegen bij rest

function replaceClasses() {
    let hidden_elements = Array.from(document.getElementsByClassName('hidden'));
    let visible_elements = Array.from(document.getElementsByClassName('visible'));

    for(let element of hidden_elements) {
        element.classList.replace('hidden','visible');
    }

    for(let element of visible_elements) {
        element.classList.replace('visible','hidden');
    }
}


function toggleAttributes() {
    let inputs = document.getElementsByTagName('input');
    for(let input of inputs) {
        input.toggleAttribute('disabled');
    }

    let select = document.getElementById('functie');
    if(select) {
        select.toggleAttribute('disabled');
    }
}

function switchToModify() {
    replaceClasses();
    document.title = document.getElementById('titel').textContent
    toggleAttributes();
    window.scrollTo(0,0); // https://css-tricks.com/need-to-scroll-to-the-top-of-the-page/#:~:text=You%20might%20need%20to%20trigger,element)%20back%20to%20the%20top.
    inputs.style.alignItems = 'initial';
}

function switchToDetails() {
    replaceClasses();
    document.title = 'Details'
    toggleAttributes();
    window.scrollTo(0,0);
    inputs.style.alignItems = 'center';
} 

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
    switchToDetails();
});

}