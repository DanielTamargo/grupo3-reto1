let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    paradas[x].onclick=Movertranvia; 
}

document.getElementById("tranvia").style.top='0%';

function Movertranvia(e){
    let id=""; 
    id=e.target.id;
    let tranvia=document.getElementById("tranvia");
    if(window.innerWidth<=("480")){
        switch(id){
            case '0':tranvia.style.top='7.5%';
                break;
            case '1':tranvia.style.top='16%';
                break;
            case '2':tranvia.style.top='25%';
                break;
            case '3':tranvia.style.top='36%';
                break;
            case '4':tranvia.style.top='45%';
                break;
            case '5':tranvia.style.top='54%';
                break;
            case '6':tranvia.style.top='63%';
                break;
            case '7':tranvia.style.top='72%';
                break;
            case '8':tranvia.style.top='81%';
                break;
        }
        
    }
    else{
        tranvia.style.left=id+id+"%";
    }
}

function cambiar(evt) {
    evt.classList.toggle("change");
    if(document.getElementsByClassName("desplegable")[0].style.width==""){
        document.getElementsByClassName("desplegable")[0].style.width="250px";
    }
    else{
        document.getElementsByClassName("desplegable")[0].style.width="";
    }
}