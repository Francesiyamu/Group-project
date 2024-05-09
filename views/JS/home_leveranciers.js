window.onload = () => {
    console.log('loaded');
    
    let selected = document.getElementById('test');
    selected.style.cursor = 'pointer'; 

    // DISABLE TEXT SELECTION WHEN DOUBLE CLICK --> TO DO
  
    selected.addEventListener('click',function(){
        window.location.href = "../leveranciers/details_aanpassen_leverancier.html"; //Zo? Of elk element in lijst als a? https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
    })

    
}