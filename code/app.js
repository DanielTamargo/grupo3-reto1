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
/** ESTADISTICAS: INICIALIZAR DATOS */

/** Obtenemos los datos del almacenamiento local (así podemos mover los datos entre páginas) */
const NOMBRE_DATOS_LOCALSTORAGE = 'datos_ficticios';
const paradas = ['Ibaiondo',  'Landaberde', 'Lakuabizkarra', 'Wellington', 'Txagorritxu', 'Euskal Herria', 'Honduras', 'Europa', 'Sancho El Sabio'];
var datos_cargados_con_exito = false;
var datos = [];
try {
    datos = localStorage.getItem(NOMBRE_DATOS_LOCALSTORAGE);
    if (datos == null || datos == undefined || datos == '') {
        // Si no existen, los inicializamos
        datos = inicializarDatos();
        localStorage.setItem(NOMBRE_DATOS_LOCALSTORAGE, JSON.stringify(datos));
        console.log('Datos inicializados con éxito.');
    } else {
        // Si existen, los cargamos
        console.log('Datos cargados con éxito.');
        datos = JSON.parse(localStorage.getItem(NOMBRE_DATOS_LOCALSTORAGE));
    }
    datos_cargados_con_exito = true;
} catch (err) {
    console.error(`Error al cargar los datos:\n${err}`)
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
            // dividimos entre los dias que falten para completar el mes para sacar la proporción
            if (anyo == anyo_actual && (i + 1) == mes_actual) {
                let ultimo_dia_mes = new Date(anyo, i, 0).getDate();
                let proporcion = (ultimo_dia_mes - dia_actual) + 1;
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
/** ESTADISTICAS: GENERAR GRÁFICA */
var estilo_grafica = 1; 
// 1 = estadisticas mes seleccionado
// 2 = estadisticas generales año (?)
// 3 = estadisticas por paradas (?)

// TODO dani: descomentar y borrar
//var seleccion_mes = new Date().getMonth() + 1;
var seleccion_mes = 9
var seleccion_anyo = new Date().getFullYear();

// Variables estadísticas 1
var row_width = 0,
    row_height = 20, // Es un porcentaje, queremos mostrar 5 barras
    estadisticas_pausadas = false,
    motivo_pausa = 0; // 0 = en marcha, 1 = pausada por boton, 2 = pausada por evento

/** Preparar datos */
var datos_grafica = cargarDatosGrafica();

/** Seleccionamos el elemento SVG (imagen vectorial) */
const svg = d3.select('svg');

/** Añadimos y configuramos las rectas */
// Las añadimos
svg.selectAll('rect')
    .data(datos_grafica)
    .enter()
    .append('rect')
    .attr('fill', (d, i) => datos_grafica[i].color)
    .attr('y', (d, i) => (row_height * i + 5) + '%')
    .attr('x', 0)
    .attr('height', (row_height - 10) + '%')
    .attr('width', 0) // Anchura inicial de 0 para la animación inicial
    .on('mouseover', svgEventoMouseOver)
    .on('mouseout', svgEventoMouseOut);

// Animación inicial rectas
svg.selectAll('rect')
    .transition()
    .duration(2000)
    .attr('width', calcularPorcentajaBarraGraficaMesAnyo);

/** funciones: eventos mouse */
var contador_mouse_over = 0;
function svgEventoMouseOver(element, object) {
    // Obtenemos las posiciones
    let posX = this.width.baseVal.value / 2;
    let posY = this.y.baseVal.value - 2;

    // Preparamos el texto
    let texto = `${object.tipo} (${object.cantidad})`;
    let longitud_px_texto = texto.length * 7.7;

    // Preparamos la clase (servirá para borrarlo más adelante)
    let clase = object.id + '-tmp';
    // Preparamos el id (servirá para calcular alineación texto)
    let id = clase + '-' + contador_mouse_over;

    // Alinearemos el texto al centro cuando pueda caber
    let text_anchor = 'start';
    if (posX - longitud_px_texto / 2 > 0) {
        text_anchor = 'middle';
    }

    // Creamos el texto
    svg.append('text')
        .attr('class', 'graph-text graph-text-small' + ' ' + clase + ' ' + id)
        .attr('x', posX)
        .attr('y', posY)
        .attr('text-anchor', text_anchor)
        .text(texto);

    contador_mouse_over++;
}
function svgEventoMouseOut(element, object) {
    svg.selectAll('.' + object.id + '-tmp').remove();
}

/** Añadimos y configuramos las etiquetas de la leyenda */
// Izquierda
svg.selectAll('legend-left')
    .data(datos_grafica)
    .enter()
    .append('text')
    .attr('id', (d, i) => datos_grafica[i].id + '-name')
    .attr('x', -10) // Posición inicial de 0 para la animación inicial
    .attr('y', (d, i) => (row_height * i + 5 + (row_height / 4) + '%'))
    .attr('fill', 'black')
    .text((d, i) => datos_grafica[i].tipo)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'graph-legend legend-name graph-text');

// Cantidad
svg.selectAll('legend-qt')
    .data(datos_grafica)
    .enter()
    .append('text')
    .attr('id', (d, i) => datos_grafica[i].id + '-qt')
    .attr('x', 0) // Posición inicial de 0 para la animación inicial
    .attr('y', (d, i) => (row_height * i + 5 + (row_height / 4) + '%'))
    .attr('fill', 'black')
    .text((d, i) => datos_grafica[i].cantidad)
    .attr('dominant-baseline', 'middle')
    .attr('class', 'graph-legend legend-qt graph-text');

// Animación inicial textos cantidad
svg.selectAll('.legend-qt')
    .transition()
    .duration(2000)
    .attr('x', calcularPorcentajaBarraGraficaMesAnyo);


/** funciones: barras graficas */
function calcularPorcentajaBarraGraficaMesAnyo(d, index) {
    // Se hace una regla de 3:
    // valor maximo = 100%
    // valor actual = ???%

    // Obtenemos el valor máximo
    let valor_maximo = Math.max.apply(Math, datos_grafica.map((obj) => obj.cantidad));

    // Obtenemos el valor que estamos mirando
    let valor = datos_grafica[index].cantidad;

    // Realizamos la regla de 3 y devolvemos el % que le corresponde
    let porcentaje = valor * 100 / valor_maximo;
    return porcentaje + '%';
}

/** funciones: cargar datos grafica */
/**
 * En base al 
 * @param {string} seleccion_parada literal de la parada por la que filtrar
 * @returns array con los datos cargados para la gráfica
 */
function cargarDatosGrafica(seleccion_parada) {
    if (datos_cargados_con_exito) {
        let COLORES = ['#33C7FF', '#33FF3C', '#FCFF33', '#FFC433', '#FF7433'];
        switch(estilo_grafica) {
            case 1: // Datos totales por año y mes, sin filtrar parada
                return cargarDatosGraficaMesAnyo(COLORES);
            case 2: // Datos totales por año y mes, filtrando por parada
                return cargarDatosGraficaMesAnyo(COLORES, seleccion_parada);
            case 3: // Datos pasajeros por parada por año y mes
                console.log('WIP')
                break;
            case 4: // Datos pasajeros por parada en total
                console.log('WIP')
                break;
            case 5: // Datos por año, viendo los meses (si da tiempo y lo consigo)
                console.log('WIP')
                break;
            default:
                console.info('Opción no válida. ¿Todo bien?')
                break;
        }
    } else {
        // TODO dani: si falla al cargar datos, ¿bloquear estadísticas? ¿vaciar datos y ya?
    }
}

/**
 * Carga, de la variable global datos, los datos que vamos a utilizar en la gráfica mes año
 * Si no recibe valor de parada, sumará todos los números.
 * Si recibe valor de parada, se filtrará también por parada
 * @param {Array} COLORES array con los códigos hex de los colores a asignar a cada barra
 * @param {string} seleccion_parada texto con el nombre de la parada a cotejar
 */
function cargarDatosGraficaMesAnyo(COLORES, seleccion_parada) {
    let total_num_pasajeros = 0;
    let total_num_sin_pagar_escapados = 0;
    let total_num_sin_pagar_atrapados = 0;
    let total_num_revisores_subieron = 0;
    let total_num_incidentes = 0;

    let datos_para_la_grafica = []; // De entre todos los datos, obtenemos los que nos interesan
    for (let index in datos) { // Recorremos cada parada, recogiendo datos en base al año y mes seleccionados
        let datos_parada_mes_anyo = datos[index].filter((elm) => filtrarDatosGraficaMesAnyo(elm.anyo, elm.mes, elm.parada, seleccion_parada))[0];
        if (datos_parada_mes_anyo != null && datos_parada_mes_anyo != undefined) {
            total_num_pasajeros += datos_parada_mes_anyo.num_pasajeros;
            total_num_sin_pagar_escapados += datos_parada_mes_anyo.num_sin_pagar_escapados;
            total_num_sin_pagar_atrapados += datos_parada_mes_anyo.num_sin_pagar_atrapados;
            total_num_revisores_subieron += datos_parada_mes_anyo.num_revisores_subieron;
            total_num_incidentes += datos_parada_mes_anyo.num_incidentes;
        }
    }

    // Volcamos los datos en el array que usaremos
    datos_para_la_grafica.push({ 
        id: 'graph-pasajeros',
        tipo: 'Pasajeros',
        cantidad: total_num_pasajeros,
        color: COLORES[0]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-revisores',
        tipo: 'Revisores',
        cantidad: total_num_revisores_subieron,
        color: COLORES[1]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-sin-pagar-atrapados',
        tipo: 'SP | Atrapados',
        cantidad: total_num_sin_pagar_atrapados,
        color: COLORES[2]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-sin-pagar-escapados',
        tipo: 'SP | Escapados',
        cantidad: total_num_sin_pagar_escapados,
        color: COLORES[3]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-incidentes',
        tipo: 'Incidentes',
        cantidad: total_num_incidentes,
        color: COLORES[4]
    });

    return datos_para_la_grafica;
}

/**
 * Función que devuelve la comprobación que realizará el filtro del array
 * Si recibe el dato seleccion_parada, filtrará también por parada, si no, filtrará solo por mes y año
 * @param {int} anyo año a buscar
 * @param {int} mes  mes a buscar
 * @param {string} parada  parada a cotejar con la selección de la parada
 * @param {string} seleccion_parada  parada seleccionada para filtrar
 * @returns comprobación para el filtro
 */
function filtrarDatosGraficaMesAnyo(anyo, mes, parada, seleccion_parada) {
    if (seleccion_parada != undefined && seleccion_parada != null && seleccion_parada != '' && paradas.includes(seleccion_parada)) {
        return anyo == seleccion_anyo && mes == seleccion_mes && parada == seleccion_parada;
    } 
    return anyo == seleccion_anyo && mes == seleccion_mes;
}
/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */




