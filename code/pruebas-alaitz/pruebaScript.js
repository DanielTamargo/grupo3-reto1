let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    paradas[x].onclick=saberNumParada; 
}
let idViejo=e.target.id;

function saberNumParada(e){
    let id=""
    id=e.target.id;
    let tranvia=document.getElementById("tranvia");
    tranvia.style.animationName="";
    tranvia.style.animationName="paradas"+id;
 
}
