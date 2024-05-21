
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