window.onload = () => {
    console.log('loaded');

    let message = "";
    let counter = 1;
    let errorMsgs = document.getElementsByClassName('errorMsg');

    for(let error of errorMsgs) {
        message += `${counter}. ${error.textContent}. \n`;
        counter++
    }

    console.log(message);
    
    if(message) {
        alert(message);
    }
}