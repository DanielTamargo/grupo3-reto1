let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    paradas[x].onclick=Movertranvia; 
}

function Movertranvia(e){
    let id=""; 
    id=e.target.id;
    let tranvia=document.getElementById("tranvia");
    tranvia.style.left=id+id+"%";
    
 
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