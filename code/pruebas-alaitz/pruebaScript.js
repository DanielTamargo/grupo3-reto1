let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    paradas[x].onclick=saberNumParada; 
}

function saberNumParada(e){
    let id="";
    id=e.target.id;
    let tranvia=document.getElementById("tranvia");
    tranvia.style.animationName="";
    tranvia.style.animationName="paradas"+id;

    /*
    Esto funciona con un transition en vez de con un animation
    
    let id=""; 
    id=e.target.id;
    console.log(id);
    let tranvia=document.getElementById("tranvia");
    tranvia.style.left=id+id+"%";
    console.log(tranvia.style.left);
    */
 
}
