function cambiar(evt) {
    evt.classList.toggle("change");
    if(document.getElementsByClassName("desplegable")[0].style.width==""){
        document.getElementsByClassName("desplegable")[0].style.width="250px";
    }
    else{
        document.getElementsByClassName("desplegable")[0].style.width="";
    }
}




/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */
/** ESTADISTICAS */

/** Obtenemos los datos del almacenamiento local (así podemos mover los datos entre páginas) */
var nombre_datos_localStorage = 'datos_ficticios';
var datos = localStorage.getItem(nombre_datos_localStorage);
if (datos == null || datos == undefined || datos == '') {
    // Si no existen, los inicializamos
    datos = inicializarDatos();
    localStorage.setItem(nombre_datos_localStorage, JSON.stringify(datos));
    console.log('Datos inicializados con éxito.');
} else {
    // Si existen, los cargamos
    console.log('Datos cargados con éxito.');
    datos = JSON.parse(localStorage.getItem(nombre_datos_localStorage));
}


/** ----------------------------------------------------------------- */
/** INICIALIZAR DATOS */
/** Función que inicializa todos los datos */
function inicializarDatos() {
    /** Tabla que se pretende simular:
     *  año | mes | parada | num_pasajeros | num_sin_pagar_escapados | num_sin_pagar_atrapados | num_revisores_subieron | num_incidentes
     */

    // TODO cuando surge una incidencia, ¿mostrarlo como alerta?

    // TODO confirmar con Raúl nombres paradas
    let paradas = ['Ibaiondo',  'Landaberde', 'Lakuabizkarra', 'Wellington', 'Txagorritxu', 'Euskal Herria', 'Honduras', 'Europa', 'Sancho El Sabio'];

    let array_datos = [];

    for (let parada of paradas) {
        array_datos.push(inicializarDatosParada(parada));
    }

    return array_datos;
}

/** 
 * Inicializa los datos para una parada y los devuelve en un objeto
 * Generará, desde Enero de 2020, una serie de datos aleatorios por mes, volcados todos en un 
 * @param {string} parada [parada sobre la cual generará los datos]
 * @returns {Array[Object]} [array de objetos con todos los datos generados]
 */
function inicializarDatosParada(parada) {
    let array = [];
    
    // Generamos datos desde 2020
    let anyo = 2020;
    let fecha_actual = new Date();
    let anyo_actual = fecha_actual.getFullYear();
    let mes_actual = fecha_actual.getMonth() + 1;
    let dia_actual = fecha_actual.getDate();

    let num_meses = 12;

    let num_pasajeros;
    let num_sin_pagar_escapados;
    let num_sin_pagar_atrapados;
    let num_revisores_subieron;
    let num_incidentes;

    while (anyo <= anyo_actual) {
        if (anyo == anyo_actual) {
            num_meses = mes_actual;
        }
        for (let i = 0; i < num_meses; i++) {
            num_pasajeros = numeroRandom(3000, 5000);
            num_sin_pagar_escapados = numeroRandom(0, 800);
            num_sin_pagar_atrapados = numeroRandom(0, 300);
            num_revisores_subieron = numeroRandom(150, 400);
            num_incidentes = numeroRandom(0, 20);

            // Si coincide que está justo en el mes y año actual, 
            // dividimos los números para sacar la proporción
            if (anyo == anyo_actual && i == mes_actual) {
                let ultimo_dia_mes = new Date(anyo, i, 0).getDate();
                let proporcion = ultimo_dia_mes * dia_actual / 100;
                num_pasajeros = parseInt(num_pasajeros / proporcion);
                num_sin_pagar_escapados = parseInt(num_sin_pagar_escapados / proporcion);
                num_sin_pagar_atrapados = parseInt(num_sin_pagar_atrapados / proporcion);
                num_revisores_subieron = parseInt(num_revisores_subieron / proporcion);
                num_incidentes = parseInt(num_incidentes / proporcion);
            }

            array.push({
                anyo: anyo,
                mes: (i + 1),
                parada: parada,
                num_pasajeros: num_pasajeros,
                num_sin_pagar_atrapados: num_sin_pagar_atrapados,
                num_sin_pagar_escapados: num_sin_pagar_escapados,
                num_revisores_subieron: num_revisores_subieron,
                num_incidentes: num_incidentes
            });
        }
        anyo++;
    }

    return array;
}

function numeroRandom(minimo, maximo) {
    return Math.floor(Math.random() * (maximo - minimo + 1) + minimo)
}

/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */

