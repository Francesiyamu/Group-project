/*clickable rows*/




document.addEventListener("DOMContentLoaded", ()=>{
  const rows = document.querySelectorAll("tr[data-href");
  rows.forEach(row => {
    row.addEventListener("click", () =>{
      window.location.href = row.dataset.href;
    })
  })
 })
 
 

 
 
 
 /*editable table

const table = document.getElementById('table');
const cells = table.getElementsByTagName('td');

for( let i =0; i < cells.length; i++){
  cells[i].onclick = function(){

    if(this.hasAttribute('data-clicked')){
      return;

    }

    this.setAttribute('data-clicked', 'yes');
    this.setAttribute('data-text', this.innerHTML);


    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = this.innerHTML;
    input.style.width = this.offsetWidth - (this.clientLeft * 2) + "px";
    input.style.height = this.offsetHeight -(this.clientTop *2) + "px";
    input.style.border = "0px";
    input.style.fontFamily = "inherit";
    input.style.textAlign = "inherit";
    input.style.backgroundColor = "lightgrey";


    input.onblur = function(){
      const td = input.parentElement;
      var orig_text = input.parentElement.getAttribute('data-text');
      const current_text = this.value;

      if(orig_text != current_text){
        //there are changes in the cell's text
        // save to db 
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        td.innerHTML = current_text;
        td.style.cssText = 'padding: 10px 20px';
        console.log(orig_text + ' is changed to ' + current_text);
      } else{
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        td.innerHTML = orig_text;
        td.style.cssText = 'padding: 10px 20px';
        console.log('No changes Made')
      }
    }

    input.onkeydown = function(event){
      if(event.key === 'Enter'){
          this.onblur();
      }
  };
  
    

    this.innerHTML = '';
    this.style.cssText = 'padding: 0px 0px';
    this.append(input);
    this.firstElementChild.select();
  }
} 

*/