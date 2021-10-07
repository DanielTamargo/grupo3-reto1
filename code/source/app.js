/*
------------------------------------------------------------
INICIO MODAL BOX
-----------------------------------------------------------
*/

//según abrir la pagina que saque el modal box con las opciones de marcha
var modal = document.getElementById("Mimodal");
modal.style.display = "block";
/*
-----------------------------------------------------------
CAMBIAR MODO
-----------------------------------------------------------
*/

function cambiarModo(){
    document.getElementsByClassName("introducirMilimetros")[0].style.display="none";
    modal.style.display = "block";
}

var btn = document.getElementById("btnModal");

//coger opcion seleccionada de tipo de marcha
var opc = "";
let idOpc="";
function elegirOpc(idOpc){
    if(window.innerWidth<="480"){
        document.getElementById("tranvia").style.top="-7.5%";
    }
    else{
        document.getElementById("tranvia").style.left="-13.1875%";
    }
    if(idOpc=="milimetros"){
        opc="milimetros"
        document.getElementById("distancia").value="true";
        document.getElementById("directo").value="false";
        $("#bEnviarModo").trigger("click");
        let introducirMilimetros=document.getElementsByClassName("introducirMilimetros");
        modal.style.display = "none";
        introducirMilimetros[0].style.display="inline";
        paradasPorMilimetro();
    }
    else{
        opc="directa"
        document.getElementById("distancia").value="false";
        document.getElementById("directo").value="true";
        $("#bEnviarModo").trigger("click");
        modal.style.display = "none";
        paradasDirecta();
    }
}

/*
---------------------------------------------------------------------
INICIO PARADAS TRANVIA COGER ID PARADA Y HACER TRANSICIÓN
-------------------------------------------------------------------
*/

function paradasDirecta(){
    let paradas=document.getElementsByClassName("paradas");
    var idParada="";
    for(let x=0;x<paradas.length;x++){
        paradas[x].onclick=Movertranvia;
    }

    function Movertranvia(e){
        var id=""; 
        id=e.target.id;
        let tranvia=document.getElementById("tranvia");
        if(opc!="milimetros")
        {
            document.getElementById("textoParada").value=Number(id)+Number(1);
            if(window.innerWidth<=("480")){
                switch(id){
                    case '0':
                        tranvia.style.top='2.5%';
                        break;
                    case '1':
                        tranvia.style.top='13%';
                        break;
                    case '2':
                        tranvia.style.top='23.5%';
                        break;
                    case '3':
                        tranvia.style.top='34%';
                        break;
                    case '4':
                        tranvia.style.top='44.5%';
                        break;
                    case '5':
                        tranvia.style.top='55%';
                        break;
                    case '6':
                        tranvia.style.top='65.5%';
                        break;
                    case '7':
                        tranvia.style.top='76%';
                        break;
                    case '8':
                        tranvia.style.top='86.5%';
                        break;
                }
            }
            else{
                switch(id){
                    case '0':
                        tranvia.style.left='2%';
                        break;
                    case '1':
                        tranvia.style.left='15.1875%';
                        break;
                    case '2':
                        tranvia.style.left='28.375%';
                        break;
                    case '3':
                        tranvia.style.left='41.5625%';
                        break;
                    case '4':
                        tranvia.style.left='54.75%';
                        break;
                    case '5':
                        tranvia.style.left='67.9375%';
                        break;
                    case '6':
                        tranvia.style.left='81.1225%';
                        break;
                    case '7':
                        tranvia.style.left='94.31%';
                        break;
                    case '8':
                        tranvia.style.left='107.5%';
                        break;
                }
            }
        }
        $("#btnSubmitDirecto").trigger("click");
    }
}
function paradasPorMilimetro(){
    let paradas=document.getElementsByClassName("paradas");
    let bEnviar=document.getElementById("Bintroducir");
    bEnviar.onclick=Movertranvia;
    
    function Movertranvia(e){
        let tranvia=document.getElementById("tranvia");
        if(window.innerWidth<=("480")){
            mover();

            function mover(){
                var milimetro=document.getElementById("Imilimetro");
                milimetro=Number(milimetro.value);
                if(milimetro<0 || milimetro>50000){
                    alert("No se admiten valores menores de 0 y mayores que 50000");
                }
                else{
                    let distanciaParadas=5000;
                    let paradasRecorre=parseInt(milimetro/distanciaParadas);
                    let resto=milimetro % distanciaParadas;
                    let porcentajeExtra=(resto*10.5/distanciaParadas);
                    let porcentaje=2.5+((paradasRecorre-1)*10.5)+porcentajeExtra;
                    tranvia.style.top = porcentaje+"%";
                    $("#bEnviarMm").trigger("click");
                }   
            }
        }
        else{
           mover();

            function mover(){
                let milimetro=document.getElementById("Imilimetro");
                milimetro=Number(milimetro.value);
                if(milimetro<0 || milimetro>50000){
                    alert("No se pueden introducir valores menores de 0 y mayores de 50000")
                }
                else{
                     let distanciaParadas=5000;
                        let paradasRecorre=parseInt(milimetro/distanciaParadas);
                        let resto=milimetro % distanciaParadas;
                        let porcentajeExtra=(resto*13.1875/distanciaParadas);
                        let porcentaje=2+((paradasRecorre-1)*13.1875)+porcentajeExtra;
                        tranvia.style.left = porcentaje+"%";
                        $("#bEnviarMm").trigger("click");
                }
            }
        }
        document.getElementById("Imilimetro").value="";
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

$(document).ready(function(){
    $("#enviarDirecto").submit(function(){
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize()
        });
        return false;
    });

});

$(document).ready(function(){
    $("#enviarModo").submit(function(){
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize()
        });
        return false;
    });

});

$(document).ready(function(){
    $("#enviarMilimetro").submit(function(){
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize()
        });
        return false;
    });
});
