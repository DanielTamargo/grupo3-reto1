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