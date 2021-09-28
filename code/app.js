function cambiar(evt) {
    evt.classList.toggle("change");
    if(document.getElementsByClassName("desplegable")[0].style.width==""){
        document.getElementsByClassName("desplegable")[0].style.width="30%";
    }
    else{
        document.getElementsByClassName("desplegable")[0].style.width="";
    }
}