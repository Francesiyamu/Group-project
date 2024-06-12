window.onload = function () {
    console.log('loaded');

    let gebruikers_items = document.getElementsByClassName('gebruikers_item');
    let level = localStorage.getItem('level');

    console.log(level);
    if(level != 1) {
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
                document.title = document.getElementsByClassName('titel')[i].textContent;
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
        if(btn_number<3) {
            return containers[btn_number];
        } else {
            return containers[btn_number-3]; /* Btns klein scherm > 3, maar aantal containers = 3 */
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


    // Close main navbar when click on screen --> bij elke JS script
    let body_without_navbar = document.getElementById('body_without_navbar');
    body_without_navbar.addEventListener('click',function(){
        let navbar = document.getElementById('navbarToggler');
        navbar.classList.remove('show');
    })
}