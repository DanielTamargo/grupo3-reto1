let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    idParada=paradas[x].onclick=saberNumParada; 
}

function saberNumParada(e){
    let id=""
    id=e.target.id;
    console.log(id)
    let tranvia=document.getElementById("tranvia");
    tranvia.style.animationName="";
    tranvia.style.animationName="paradas"+id;
    switch(id){
        case 0:
            tranvia.style.left="0%";
            break;
        case 1:
            tranvia.style.left="11%";
            break;
        case 2:
            tranvia.style.left="22%";
            break;
        case 3:
            tranvia.style.left="33%";
            break;
    }
}
