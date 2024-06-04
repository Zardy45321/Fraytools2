//const { ipcRenderer } = require('electron');

//function openFolder() {
//    ipcRenderer.invoke('open-folder-dialog');
//}

//var links = {
//    var links = {'project-cleanup':'project-cleanup'};

var rGear = 0;

function rotateGear() {
    rGear = rGear +10;
    if (rGear >= 360) {
        rGear = 0;
    }
    var text = 'rotate('+rGear+'deg)';
    var gear = document.getElementById('gear');
    
    gear.style.webkitTransform = text;
}



document.addEventListener('DOMContentLoaded', (event) => {
    
    var gear = document.getElementById('gear');
    var gHolder = document.getElementById('gHolder');
    var gearMsg = document.getElementById('gearMsg');
    console.log(gearMsg);
    console.log(gear);
    var interval = '';
    gear.addEventListener('mouseover', function() {
        interval = setInterval(rotateGear, 50);
        console.log(gHolder.getBoundingClientRect());
        gearMsg.style.left = (gHolder.getBoundingClientRect().left - 100)+'px';
        gearMsg.classList.add('g-desc-show');
        console.log(gearMsg.classList);
    });
    
    gear.addEventListener('mouseout', function() {
        clearInterval(interval);
        gearMsg.classList.remove('g-desc-show');
    });
    
    gear.addEventListener('click', function() {
        console.log('Clicked');
        gear.style.webkitTransform = '';
        //gear.classList.remove('settings-gear');
        gear2 = document.createElement('img');
        gear2.classList.add('settings-gear');
        gear2.src = './assets/svg/Gear.svg';
        document.body.appendChild(gear2);
        gear2.style.position = 'fixed';
        gear2.style.left = gear.getBoundingClientRect().left+'px';
        gear2.style.top = gear.getBoundingClientRect().top+'px';
        
        gear.classList.add('settings-gear-hide');
        gear2.classList.add('settings-gear-center');
        gear2.style.webkitTransform = 'translate('+ (-1*(window.innerWidth / 2)+10)+'px, '+(window.innerHeight / 2 - 10)+'px)';
        
        setTimeout(function() {
            console.log('here');
            gear2.classList.remove('settings-gear-center');
            gear2.style.left = gear2.getBoundingClientRect().left+'px';
            gear2.style.top = gear2.getBoundingClientRect().top+'px';
            gear2.style.webkitTransform = null;
            setTimeout(function() {
                gear2.classList.add('settings-gear-center');
                gear2.style.webkitTransform = 'scale(150)';
                document.getElementById('allContent').classList.add('all-content-hide');
                setTimeout(function() {
                    document.getElementById('settings').classList.add('settings-show');
                }, 1050);
            }, 10);
            
        }, 1050);
        
        
        //document.getElementById('main-content').classList.add('settings-gear-center');
    });
        
    var containers = document.getElementsByClassName('pc-box');

    for (let c of containers) {
        var p = c.getElementsByTagName('p')[0];
        p.classList.add('p-hover');

        c.addEventListener('mouseover', (event) => {
            var elms = document.getElementsByClassName('pc-box');
            event.stopPropagation();
            for (let e of elms) {
                if (e.id != c.id) {
                    e.classList.add("faded");
                } else {
                    e.classList.add('card-select');

                    var p = e.getElementsByTagName('p')[0];
                    p.classList.add('p-hover-anim');

                    var img = e.getElementsByTagName('img')[0];
                    img.classList.add('gif-show');
                    //img.addEventListener('animationend', (event) => {
                    //    img.classList.remove('slide-upward');
                    //});

                    //crystal.classList.remove('slide-down');


                }
            }

        });


        c.addEventListener('mouseout', (event) => {
            var elms = document.getElementsByClassName('pc-box');
            event.stopPropagation();
            for (let e of elms) {
                if (e.id != c.id) {
                    e.classList.remove("faded");
                } else {
                    var a = e.getElementsByTagName('p')[0];
                    a.classList.remove('p-hover-anim');
                    var img = e.getElementsByTagName('img')[0];
                    img.classList.remove('gif-show');

                }
            }

        });


        c.addEventListener('click', (event) => {
            var origin = window.location.origin;
            console.log(origin);

            window.location.href = './subpages/'+c.id+'.html';
        });
    }
        
        
});
