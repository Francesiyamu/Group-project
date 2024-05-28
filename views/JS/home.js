window.onload = () => {
    console.log('loaded');

    let gebruikers_items = document.getElementsByClassName('gebruikers_item');
    let no_boekhouder_items = document.getElementsByClassName('no_boekhouder');
    let level = localStorage.getItem('level');

    level = 3;

    console.log(no_boekhouder_items);
    console.log(gebruikers_items)
    console.log(level);
    if(level == 3) {
        for(let no_boekhouder_item of no_boekhouder_items) {
            no_boekhouder_item.style.display = "none";
        }
        document.getElementById('fact_lev_menu').style.width = "max-content";
    } else if(level != 1) {
        console.log(level);
        for(let gebruikers_item of gebruikers_items) {
            gebruikers_item.style.display = "none";
        }
    }

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
