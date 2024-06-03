window.onload = () => {
    console.log('loaded');

    let gebruikers_items = document.getElementsByClassName('gebruikers_item');
    let no_boekhouder_items = document.getElementsByClassName('no_boekhouder');
    let level = localStorage.getItem('level');

    console.log(level);
    if(level == 3) {
        for(let no_boekhouder_item of no_boekhouder_items) {
            no_boekhouder_item.style.display = "none";
        }
    } else if(level != 1) {
        console.log(level);
        for(let gebruikers_item of gebruikers_items) {
            gebruikers_item.style.display = "none";
        }
    }


    // MEDIA QUERY
    function largeWidth(largeScreenBoekhouder) {
        if(largeScreenBoekhouder.matches) {
            let li_items_navbar = document.querySelectorAll('.large_screen_nav li');
            for(let item of li_items_navbar) {
                item.style.width = 'max-content';
            }
        }
    }

    function mediumWidth(mediumScreenBoekhouder) {
        if(mediumScreenBoekhouder.matches) {
            let logo = document.querySelector('.medium_screen_nav #logo');
            logo.style.width = '60px';
            let li_items_navbar = document.querySelectorAll('.medium_screen_nav li');
            for(let item of li_items_navbar) {
                item.style.padding = '1.3rem 1rem';
                item.style.listStyleType = 'none';
            }            
        }
    }

    const largeScreenBoekhouder = window.matchMedia("(max-width: 1197px)");
    const mediumScreenBoekhouder = window.matchMedia("(max-width: 950px");

    largeScreenBoekhouder.addEventListener('change',function() {
        if(level == 3) {
            largeWidth(largeScreenBoekhouder);
        }
    })

    mediumScreenBoekhouder.addEventListener('change',function(){
        if(level == 3) {
            mediumWidth(mediumScreenBoekhouder);
        }
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
