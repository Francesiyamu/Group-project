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
  
    //HOME PAGE
    let logos = document.getElementsByClassName('home');
    if(level == 1) {
        for(let logo of logos) {
            logo.style.cursor = 'pointer';
            logo.setAttribute('href','../chartspage');
        }
    } else if(level == 2) {
        for(let logo of logos) {
            logo.style.cursor = 'pointer';
            logo.setAttribute('href','../klanten/home_klanten.html');
        }
    } else if(level == 3) {
        for(let logo of logos) {
            logo.style.cursor = 'pointer';
            logo.setAttribute('href','../klant_factuur/home_klantFacturen.html');
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

    // FILTER
    document.querySelector("#table_home > tbody > tr:nth-child(1) > td:nth-child(2) ").innerHTML;
    // Get unique values for the desired columns
    getUniqueValuesFromColumn();

    function getUniqueValuesFromColumn(){

        let unique_col_values_dict = {};
    
        const allFilters = document.querySelectorAll(".table-filter")
        allFilters.forEach((filter_i) => {
            const col_index = filter_i.parentElement.getAttribute("col-index");
            //alert(col_index)
    
            const rows = document.querySelectorAll("#table_home > tbody > tr")
    
            rows.forEach((row) => {
                const cell_value = row.querySelector("td:nth-child("+col_index+")").innerHTML.trim();
                // if the col index is already present in the dict
                if (unique_col_values_dict[col_index]) {
    
                    // if the cell value is already present in the array
                    if (unique_col_values_dict[col_index].includes(cell_value)) {
    
                    } else {
                        unique_col_values_dict[col_index].push(cell_value)
                        
                    }
    
    
                } else {
                    unique_col_values_dict[col_index] = new Array(cell_value)
                }
    
            });
        });
    
        for(let i in unique_col_values_dict) {
            //alert("Column index : " + i + " has Unique values : \n" + unique_col_values_dict[i]);
        }
    
        updateSelectOptions(unique_col_values_dict)
    };
    
    //Add <option> tags to the desired columns based on the unique values
    function updateSelectOptions(unique_col_values_dict) {
        const allFilters = document.querySelectorAll(".table-filter");
    
        allFilters.forEach((filter_i) => {
            const col_index = filter_i.parentElement.getAttribute('col-index')
    
            unique_col_values_dict[col_index].forEach((i) => {
                filter_i.innerHTML += `\n<option value="${i}">${i}</option>`
            });
    
        });
    };
    
    // Create filter_rows() function
    function filter_rows() {
        const allFilters = document.querySelectorAll(".table-filter")
        let filter_value_dict = {}
    
        allFilters.forEach((filter_i) => {
           const col_index = filter_i.parentElement.getAttribute('col-index')
    
            const value = filter_i.value
            if (value !== "all") {
                filter_value_dict[col_index] = value;
            }
        });
    
    
        const rows = document.querySelectorAll("#table_home tbody tr");
        rows.forEach((row) => {
            let display_row = true;
            let col_cell_value_dict = {};
    
            allFilters.forEach((filter_i) => {
                const col_index = filter_i.parentElement.getAttribute('col-index');
                col_cell_value_dict[col_index] = row.querySelector("td:nth-child(" + col_index+ ")").innerHTML
            });
    
            for (let col_i in filter_value_dict) {
               const filter_value = filter_value_dict[col_i]
                const row_cell_value = col_cell_value_dict[col_i]
                
                if (row_cell_value.indexOf(filter_value) === -1 && filter_value !== "all") {
                    display_row = false;
                    break;
                }
            }
    
    
            row.style.display = display_row ? "table-row" : "none";
    
        });
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




//DROPDOWN SELECT FUNCTION   

