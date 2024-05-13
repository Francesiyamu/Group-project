window.onload = () => {
    console.log('loaded');
    

    let selected = Array.from(document.getElementsByClassName('factuurLijnen'));

    // DISABLE TEXT SELECTION WHEN DOUBLE CLICK --> TO DO


    for(let element of selected) {
        element.style.cursor = 'pointer'; 
        element.addEventListener('click',function(){
            window.location.href = "../klant_factuur/details_aanpassen_klantFactuur.html"; //Zo? Of elk element in lijst als a? https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        })
    }
}