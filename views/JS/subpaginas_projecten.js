window.onload = function () {
    console.log('loaded');

    let buttons_subnav = document.getElementsByClassName('subnav-btn');
    let containers = document.getElementsByClassName('container');

    for(let i=0;i < buttons_subnav.length;i++) {
        let button = buttons_subnav[i];
        button.addEventListener('click',function(){
            if (!button.classList.contains('subnav_active')) { /* Enkel doen als btn waarop geklikt wordt nog niet actief was */
                let corresponding_btn = findCorrespondingButton(button,buttons_subnav);
                let corresponding_container = findCorrespondingContainer(i,containers);   
                removeCurrentActive(buttons_subnav,containers);
                changeToActive(button,corresponding_btn,corresponding_container);
            }
        })
    }

    function findCorrespondingButton(button,buttons_subnav){
        for(let item of buttons_subnav) {
            if((button.textContent == item.textContent) && (button != item)) {
                return item;
            }
        }
    }

    function findCorrespondingContainer(btn_number,containers) {
        if(btn_number<5) {
            return containers[btn_number];
        } else {
            return containers[btn_number-5]; /* Btns klein scherm > 5, maar aantal containers = 5 */
        }
    }

    function removeCurrentActive(buttons_subnav,containers) {
        for(let item of buttons_subnav) {
            if(item.classList.contains('subnav_active')){
                item.classList.remove('subnav_active');
            }
        }

        for(let container of containers) {
            if(container.classList.contains('visible')){
                container.classList.replace('visible','hidden');
            }
        }
    }

    function changeToActive(btn, corresponding_btn,corresponding_container) {
        btn.classList.add('subnav_active');
        corresponding_btn.classList.add('subnav_active');
        corresponding_container.classList.replace('hidden','visible');
    }






}