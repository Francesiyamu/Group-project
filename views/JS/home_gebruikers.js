window.onload = () => {
    console.log('loaded');
    
    let selected = document.getElementById('test');
    selected.style.cursor = 'pointer'; 

    // DISABLE TEXT SELECTION WHEN DOUBLE CLICK --> TO DO
  
    selected.addEventListener('click',function(){
        window.location.href = "../gebruikers/details_aanpassen_gebruiker.html"; //Zo? Of elk element in lijst als a? https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
    })

    
}
function tableSearch() {
    let input, filter, table, tr, td, i, j, txtValue;
    
    input = document.getElementById("searchBox");
    filter = input.value.toUpperCase();
    table = document.getElementById("table").getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    
    // Loop through all table rows, excluding the header row
    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none"; // Hide the row initially
        
        td = tr[i].getElementsByTagName("td");
        // Loop through all table columns
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = ""; // Show the row if a match is found
                    break; // Stop checking other columns in this row
                }
            }
        }
    }
}
