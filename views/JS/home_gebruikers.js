window.onload = () => {
    console.log('loaded');

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
}
