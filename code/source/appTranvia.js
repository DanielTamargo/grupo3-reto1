let paradas=document.getElementsByClassName("paradas");
var idParada="";
for(let x=0;x<paradas.length;x++){
    idParada=paradas[x].onclick=saberNumParada;
}

function saberNumParada(e){
    let id=""
    id=e.target.id;
    console.log(id)
    return idParada;
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