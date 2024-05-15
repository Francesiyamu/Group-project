window.onload = () => {
    console.log('loaded');
    
 /*   let selected = document.getElementById('test');
    selected.style.cursor = 'pointer'; 

    // DISABLE TEXT SELECTION WHEN DOUBLE CLICK --> TO DO
  
    selected.addEventListener('click',function(){
        window.location.href = "../leveranciers/details_aanpassen_leverancier.html"; //Zo? Of elk element in lijst als a? https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
    }) */

    let search_icon_btn1 = document.getElementById('search_icon_btn1');
    let visible = false; //In beginning, search bar is not visible
    search_icon_btn1.addEventListener('click',function(){
        // Show search bar
        let searchbar_small = document.getElementById('searchbar_small');
        if(!visible) {
            searchbar_small.style.display = 'initial';
            visible = true;
        } else {
            searchbar_small.style.display = 'none';
            visible = false;
        }
    })


    
}