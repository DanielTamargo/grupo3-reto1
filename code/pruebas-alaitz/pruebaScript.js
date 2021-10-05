let paradas=document.getElementsByClassName("paradas");
var idParada="";

for(let x=0;x<paradas.length;x++){
    paradas[x].onclick=saberNumParada; 
}

function saberNumParada(e){
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
}


