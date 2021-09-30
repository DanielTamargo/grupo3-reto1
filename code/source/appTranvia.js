/*
------------------------------------------------------------
INICIO MODAL BOX
-----------------------------------------------------------
*/

//según abrir la pagina que saque el modal box con las opciones de marcha
var modal=document.getElementById("Mimodal");
modal.style.display = "block";

var btn=document.getElementById("btnModal");
var btnCerrar=document.getElementsByClassName("close")[0];

btnCerrar.onclick=function(){
    modal.style.display="none";
}

//cojer opcion seleccionada de tipo de marcha
var opc="";
opc=document.getElementsByClassName("tipoRecorrido");
opc.onclick=prueba;

function prueba(){
    console.log("a")
    if(opc[0].id="parada"){
        opc="p";
    }
    else{
        opc="d";
    }
}

/*
-----------------------------------------------------------
INICIO PARADAS TRANVIA COJER ID PARADA Y HACER TRANSICIÓN
-----------------------------------------------------------
*/
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
            case '0':tranvia.style.top='22%';
                break;
            case '1':tranvia.style.top='28%';
                break;
            case '2':tranvia.style.top='34%';
                break;
            case '3':tranvia.style.top='40%';
                break;
            case '4':tranvia.style.top='46%';
                break;
            case '5':tranvia.style.top='52%';
                break;
            case '6':tranvia.style.top='58%';
                break;
            case '7':tranvia.style.top='64%';
                break;
            case '8':tranvia.style.top='70%';
                break;
        }
        
    }
    else{
        switch(id){
            case '0':tranvia.style.left='-2%';
                break;
            case '1':tranvia.style.left='9%';
                break;
            case '2':tranvia.style.left='20%';
                break;
            case '3':tranvia.style.left='31%';
                break;
            case '4':tranvia.style.left='42%';
                break;
            case '5':tranvia.style.left='53%';
                break;
            case '6':tranvia.style.left='64%';
                break;
            case '7':tranvia.style.left='75%';
                break;
            case '8':tranvia.style.left='86%';
                break;
        }
    }
}
/*
-----------------------------------------------------------
INICIO TRANSICIÓN DE ICONO DE MENÚ A X
-----------------------------------------------------------
*/

function cambiar(evt) {
    evt.classList.toggle("change");
    if(document.getElementsByClassName("desplegable")[0].style.width==""){
        document.getElementsByClassName("desplegable")[0].style.width="250px";
    }
    else{
        document.getElementsByClassName("desplegable")[0].style.width="";
    }
}
