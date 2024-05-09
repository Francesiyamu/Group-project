window.onload = () => {
    console.log('loaded');
    
    let selected = document.getElementById('test');
    selected.style.cursor = 'pointer'; 

    // DISABLE TEXT SELECTION WHEN DOUBLE CLICK --> TO DO
  
    selected.addEventListener('click',function(){
        window.location.href = "../gebruikers/details_aanpassen_gebruiker.html"; //Zo? Of elk element in lijst als a? https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
    })

    
}