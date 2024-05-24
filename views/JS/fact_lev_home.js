
// Get unique values for the desired columns
window.onload = () => {
    document.querySelector("#table > tbody > tr:nth-child(1) > td:nth-child(2) ").innerHTML;
    };
    getUniqueValuesFromColumn();
   



function getUniqueValuesFromColumn(){

    let unique_col_values_dict = {};

    const allFilters = document.querySelectorAll(".table-filter")
    allFilters.forEach((filter_i) => {
        const col_index = filter_i.parentElement.getAttribute("col-index");
        //alert(col_index)

        const rows = document.querySelectorAll("#table > tbody > tr")

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


    const rows = document.querySelectorAll("#table tbody tr");
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









/* Another method of creating a filter for all columns


document.addEventListener('DOMContentLoaded', function(event){
  let colHeaders = document.querySelectorAll('.tblColText');

  colHeaders.forEach((colHeader, index) =>{
      //console.log('index is: ' + index + ', ' + colHeader.textContent);
      colHeader.appendChild(generateDropdown(index));
  });
});

function generateDropdown(index){
  let columnData = [];
  let rows = document.querySelectorAll('tr');
  rows.forEach((row, i) =>{
      if(i == 0){
          columnData.push('');
          return;
      } 
      let cells = row.getElementsByTagName('td');
      columnData.push(cells[index].innerText);
  })

  // Remove duplicates
  let uniqColumnData = [...new Set(columnData)];

  //Generate the select option
  let select = document.createElement('select');

  uniqColumnData.map((data, i)=>{
      let option = document.createElement('option');
      option.setAttribute('value', data);

      let optionText = document.createTextNode(data);
      option.appendChild(optionText);

      select.appendChild(option);
  });

  select.setAttribute('id', index);
  select.addEventListener('change', function (){
      filterTable(this.value);
      clearSelect(select.id);
  });
  return select;
}


function clearSelect(id){
  let selects = document.querySelectorAll('select');
  selects.forEach((select, i)=>{
      if(id != i){
          select.value = '';
      }
  });
}

function filterTable(filter){
    //console.log(filter);
  const table = document.querySelector('#tblBox');
  const rows = table.getElementsByTagName('tr');

  // Loop through all rows except for headers
  for(let i = 1; i < rows.length; i++){
      const cells = rows[i].getElementsByTagName('td');
      let found = false;

  // Loop through all cells within row

  for(let j = 0; j < cells.length; j++){
          const cellsText = cells[j].textContent || cells[j].innerText;
          if(cellsText == filter){
              found = true;
              break;
          }
      }
      rows[i].style.display = found ? '' : 'none';
  }
}
*/