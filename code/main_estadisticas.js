/** ----------------------------------------------------------------- */
/** FUNCIONES COMUNES */
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
/** CONSTANTES */
const LOCALSTORAGE_CLAVE_DATOS = 'datos_ficticios';
const LOCALSTORAGE_CLAVE_ESTILOGRAFICA = 'estilo_grafica';
const LOCALSTORAGE_CLAVE_PARADASELECCIONADA = 'parada_seleccionada';
const COLORES = ['#33C7FF', '#33FF3C', '#FCFF33', '#FFC433', '#FF7433'];
const PARADAS = ['Ibaiondo',  'Landaberde', 'Lakuabizkarra', 'Wellington', 'Txagorritxu', 'Euskal Herria', 'Honduras', 'Europa', 'Sancho El Sabio'];
const TITULOS_GRAFICAS = ['Datos {mes}/{año}', 'Datos {parada} {mes}/{año}',
                        'Pasajeros {mes}/{año}', 'Pasajeros {año}', 'Datos tiempo real'];
const DESC_GRAFICAS = ['Muestra los datos generales de todas las paradas filtrando por año y por mes.',
'Muestra los datos generales pero filtrando, además de por año y mes, también por parada', 
'Muestra el número total de pasajeros por cada parada en el año y mes especificados',
'Muestra el número total de pasajeros por año.',
'Muestra la entrada de datos en tiempo real, mostrando los datos generales que se van recopilando continuamente.'];

/** ----------------------------------------------------------------- */
/** ESTADISTICAS: INICIALIZAR DATOS */

/** Obtenemos los datos del almacenamiento local 
 * (así podemos mover los datos entre páginas) */
var datos_cargados_con_exito = false;
var datos = [];

/** Cargar datos del almacenamiento local */
try {
    datos = localStorage.getItem(LOCALSTORAGE_CLAVE_DATOS);
    if (datos == null || datos == undefined || datos == '') {
        // Si no existen, los inicializamos
        datos = inicializarDatos();
        localStorage.setItem(LOCALSTORAGE_CLAVE_DATOS, JSON.stringify(datos));
        console.log('Datos inicializados con éxito.');
    } else {
        // Si existen, los cargamos
        console.log('Datos cargados con éxito.');
        datos = JSON.parse(localStorage.getItem(LOCALSTORAGE_CLAVE_DATOS));
    }
    datos_cargados_con_exito = true;
} catch (err) {
    console.error(`Error al cargar los datos:\n${err}`);
}

// Valores por defecto de qué gráfica se va a mostrar
var estilo_grafica = 1; 
var index_parada = 0;
var seleccion_parada = PARADAS[index_parada];
/** Miramos en el almacenamiento local si venimos de la ventana informacion */
try {
    let eg = localStorage.getItem(LOCALSTORAGE_CLAVE_ESTILOGRAFICA);
    let ps = localStorage.getItem(LOCALSTORAGE_CLAVE_PARADASELECCIONADA);

    // Miramos que existan y no sean valores no válidos o nulos
    if (eg != null && eg != undefined && eg != '' &&
    ps != null && ps != undefined && ps != '' && PARADAS.includes(ps)) {
        // Si existen, lo configuramos
        estilo_grafica = parseInt(eg);
        seleccion_parada = PARADAS[parseInt(ps)];
        index_parada = PARADAS.indexOf(seleccion_parada);
    }

} catch (err) {
    console.error(`Error al cargar especificacion:\n${err}`);
    estilo_grafica = 1;
    seleccion_parada = undefined;
}

/** ----------------------------------------------------------------- */
/** INICIALIZAR DATOS */
/** Función que inicializa todos los datos */
function inicializarDatos() {
    /** Tabla que se pretende simular:
     *  año | mes | parada | num_pasajeros | num_sin_pagar_escapados | num_sin_pagar_atrapados | num_revisores_subieron | num_incidentes
     */

    // TODO dani: cuando surge una incidencia, ¿mostrarlo como alerta?


    let array_datos = [];

    // Por cada parada se generarán una serie de datos aleatorios
    for (let parada of PARADAS) {
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

/**
 * Función que devuelve un número aleatorio entre dos valores
 * @param {int} minimo número mínimo a devolver
 * @param {int} maximo número máximo a devolver 
 * @returns 
 */
function numeroRandom(minimo, maximo) {
    return Math.floor(Math.random() * (maximo - minimo + 1) + minimo)
}

/** ----------------------------------------------------------------- */
/** ESTADISTICAS: GENERAR GRÁFICA */

// TODO dani: descomentar y borrar
var seleccion_mes = new Date().getMonth() + 1;
//var seleccion_mes = 9
var seleccion_anyo = new Date().getFullYear();

// Variables estadísticas 1
var row_width = 0,
    row_height = 20, // Es un porcentaje, queremos mostrar 5 barras
    estadisticas_pausadas = false,
    motivo_pausa = 0; // 0 = en marcha, 1 = pausada por boton, 2 = pausada por evento

    
/** Seleccionamos el elemento SVG (imagen vectorial) donde dibujar la gráfica */
const svg = d3.select('svg');

/** Preparar datos */
var datos_grafica = cargarDatosGrafica(seleccion_parada);

/** funciones: pintar gráficas */
/** Dependiendo del estilo_grafica, cargaremos una gráfica u otra */
pintarGrafica();
function pintarGrafica() {
    switch(estilo_grafica) {
        case 1:
        case 2:
            graficaDatosParada();
            break;
        case 5:
            graficaDatosACero();
            break;
        case 3:
        case 4:
            graficaParadas();
            break;
        default:
            break;
    }
}

/** Pinta la gráfica estilo 3 y 4 */
function graficaParadas() {
    /** Limpiamos el contenido */
    svg.selectAll("*").remove();

    svg.selectAll('rect')
        .data(datos_grafica)
        .enter()
        .append('rect')
        .attr('fill', () => COLORES[numeroRandom(0, COLORES.length - 1)])
        .attr('y', (d, i) => ((100 / datos_grafica.length * (i + 1)) - 100 / datos_grafica.length) + '%')
        .attr('x', 0)
        .attr('height', (d, i) => (100 / datos_grafica.length) + '%')
        .attr('width', 0)
        .attr('class', (d, i) => datos_grafica[i].clase)
        .on('mouseover', svgDatosParadaEventoMouseOver)
        .on('mouseout', svgDatosParadaEventoMouseOut);
    
    // Animación inicial rectas
    svg.selectAll('rect')
       .transition()
       .duration(2000)
       .attr('width', calcularPorcentajaBarraGraficaMesAnyo);

    /** Añadimos y configuramos las etiquetas de la leyenda */
    // Izquierda
    svg.selectAll('legend-left')
        .data(datos_grafica)
        .enter()
        .append('text')
        .attr('id', (d, i) => datos_grafica[i].id + '-name')
        .attr('x', -5)
        .attr('y', (d, i) => ((100 / datos_grafica.length * (i + 1)) - 50 / datos_grafica.length) + '%')
        .attr('fill', 'black')
        .text((d, i) => datos_grafica[i].parada)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'graph-legend legend-name graph-text medium-query-text');

    // Cantidad
    svg.selectAll('legend-qt')
        .data(datos_grafica)
        .enter()
        .append('text')
        .attr('id', (d, i) => datos_grafica[i].id + '-qt')
        .attr('x', 0) // Posición inicial de 0 para la animación inicial
        .attr('y', (d, i) =>((100 / datos_grafica.length * (i + 1)) - 50 / datos_grafica.length) + '%')
        .attr('fill', 'black')
        .text((d, i) => datos_grafica[i].cantidad)
        .attr('dominant-baseline', 'middle')
        .attr('class', 'graph-legend legend-qt graph-text');

    // Animación inicial textos cantidad
    svg.selectAll('.legend-qt')
        .transition()
        .duration(2000)
        .attr('x', calcularPorcentajaBarraGraficaMesAnyo);
}

function graficaDatosACero() {
        /** Limpiamos el contenido */
        svg.selectAll("*").remove();

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
            .on('mouseover', svgDatosParadaEventoMouseOver)
            .on('mouseout', svgDatosParadaEventoMouseOut);
    
        /** Añadimos y configuramos las etiquetas de la leyenda */
        // Izquierda
        svg.selectAll('legend-left')
            .data(datos_grafica)
            .enter()
            .append('text')
            .attr('id', (d, i) => datos_grafica[i].id + '-name')
            .attr('x', -5)
            .attr('y', (d, i) => (row_height * i + 5 + (row_height / 4) + '%'))
            .attr('fill', 'black')
            .text((d, i) => datos_grafica[i].tipo)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('class', 'graph-legend legend-name graph-text medium-query-text');
    
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
    
}

/** Pinta la gráfica estilo 1, 2 y 5, donde salen todos los 5 datos */
function graficaDatosParada() {
    /** Limpiamos el contenido */
    svg.selectAll("*").remove();

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
        .on('mouseover', svgDatosParadaEventoMouseOver)
        .on('mouseout', svgDatosParadaEventoMouseOut);

    // Animación inicial rectas (movido al método actualizarGrafica)
    svg.selectAll('rect')
        .data(datos_grafica)
        .transition()
        .duration(2000)
        .attr('width', calcularPorcentajaBarraGraficaMesAnyo);

    /** Añadimos y configuramos las etiquetas de la leyenda */
    // Izquierda
    svg.selectAll('legend-left')
        .data(datos_grafica)
        .enter()
        .append('text')
        .attr('id', (d, i) => datos_grafica[i].id + '-name')
        .attr('x', -5)
        .attr('y', (d, i) => (row_height * i + 5 + (row_height / 4) + '%'))
        .attr('fill', 'black')
        .text((d, i) => datos_grafica[i].tipo)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'graph-legend legend-name graph-text medium-query-text');

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

    // Animación inicial textos cantidad (movido al método actualizarGrafica)
    svg.selectAll('.legend-qt')
        .data(datos_grafica)
        .transition()
        .duration(2000)
        .attr('x', calcularPorcentajaBarraGraficaMesAnyo);

}

/** funciones: eventos mouse */
var contador_mouse_over = 0;
function svgDatosParadaEventoMouseOver(element, object) {
    // Obtenemos las posiciones
    let posX = this.width.baseVal.value / 2;
    let posY = this.y.baseVal.value - 2;

    // Preparamos el texto
    let texto;
    if(object.tipo != undefined) {
        texto = `${object.tipo} (${object.cantidad})`;
    } else {
        texto = `${object.parada} (${object.cantidad})`;
        posY += this.height.baseVal.value / 2 + 5;
    }
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
        .attr('class', 'no-editable graph-text graph-text-small' + ' ' + clase + ' ' + id)
        .attr('x', posX)
        .attr('y', posY)
        .attr('text-anchor', text_anchor)
        .text(texto);

    contador_mouse_over++;
}
function svgDatosParadaEventoMouseOut(element, object) {
    svg.selectAll('.' + object.id + '-tmp').remove();
}

/** funciones: barras graficas */
/**
 * En base a los valores del array datos_grafica, calcula en alcho que le corresponde
 * @param {obj} d datos 
 * @param {int} index índice del objeto que se modifica
 * @returns porcentaje de la anchura que le corresponde a la barra
 */
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
 * En base al valor de la variable estilo_grafica devolverá unso datos u otros
 * @param {string} seleccion_parada literal de la parada por la que filtrar
 * @returns array con los datos cargados para la gráfica
 */
function cargarDatosGrafica(seleccion_parada) {
    if (datos_cargados_con_exito) {
        switch(estilo_grafica) {
            case 1: // Datos totales por año y mes, sin filtrar parada
                return cargarDatosGraficaMesAnyo();
            case 2: // Datos totales por año y mes, filtrando por parada
                return cargarDatosGraficaMesAnyo(seleccion_parada);
            case 3: // Datos pasajeros por parada por año y mes
                return cargarDatosGraficaPasajerosParadasMesAnyo();
            case 4: // Datos pasajeros por parada en total
                return cargarDatosGraficaPasajerosParadasTotalAnyo();
            case 5: // Datos a 0, mostrando cambios al actualizar
                return cargarDatosACeroParaTiempoReal();
            case 6: // Datos por año, viendo los meses (si da tiempo y lo consigo)
                console.log('WIP');
                break;
            default:
                console.info('Opción no válida. ¿Todo bien?');
                break;
        }
    } else {
        // TODO dani: si falla al cargar datos, ¿bloquear estadísticas? ¿vaciar datos y ya?
        return cargarDatosACeroParaTiempoReal();
    }
}

/**
 * Devuelve un array con los datos a 0, para que se aprecie cómo se actualiza en tiempo real
 * @returns array con los datos para la gráfica
 */
function cargarDatosACeroParaTiempoReal() {
    let datos_para_la_grafica = [];

    datos_para_la_grafica.push({ 
        id: 'graph-pasajeros',
        tipo: 'Pasajeros',
        cantidad: 0,
        color: COLORES[0]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-revisores',
        tipo: 'Revisores',
        cantidad: 0,
        color: COLORES[1]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-sin-pagar-atrapados',
        tipo: 'Atrapados',
        cantidad: 0,
        color: COLORES[2]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-sin-pagar-escapados',
        tipo: 'Escapados',
        cantidad: 0,
        color: COLORES[3]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-incidentes',
        tipo: 'Incidentes',
        cantidad: 0,
        color: COLORES[4]
    });

    return datos_para_la_grafica;
}

/**
 * Carga, de la variable global datos, los datos para la gráfica num pasajeros por parada, en total
 * @returns array con los datos para la gráfica
 */
function cargarDatosGraficaPasajerosParadasTotalAnyo() {
    let nombre_parada;
    let datos_para_la_grafica = []; // De entre todos los datos, obtenemos los que nos interesan
    let total_num_pasajeros = 0;
    let array_datos_parada_mes_anyo;
    try {
        for (let index in datos) { // Recorremos cada parada, recogiendo datos en base al año y mes seleccionados
            nombre_parada = datos[index][0].parada;
            array_datos_parada_mes_anyo = datos[index].filter((elm) => filtrarDatosGraficaMesAnyo(elm.anyo, undefined, elm.parada, nombre_parada, 4));
            
            for (let elm of array_datos_parada_mes_anyo) {
                total_num_pasajeros += elm.num_pasajeros;
            }
            
            datos_para_la_grafica.push({ 
                id: 'graph-parada-' + nombre_parada.toLowerCase().replace(/ /g, ''),
                parada: nombre_parada,
                cantidad: total_num_pasajeros,
                clase: 'graph-bar'
            });

            total_num_pasajeros = 0
        }
    } catch(err) {
        console.error('Error en el método cargarDatosGraficaPasajerosParadasTotal, error:\n' + err);
    } finally {
        return datos_para_la_grafica;
    }
}

/**
 * Carga, de la variable global datos, los datos para la gráfica num pasajeros por parada, mes y año
 * @returns array con los datos para la gráfica
 */
function cargarDatosGraficaPasajerosParadasMesAnyo() {
    let nombre_parada;
    let datos_para_la_grafica = []; // De entre todos los datos, obtenemos los que nos interesan

    for (let index in datos) { // Recorremos cada parada, recogiendo datos en base al año y mes seleccionados
        nombre_parada = datos[index][0].parada;
        let datos_parada_mes_anyo = datos[index].filter((elm) => filtrarDatosGraficaMesAnyo(elm.anyo, elm.mes, elm.parada, nombre_parada, 3))[0];
        if (datos_parada_mes_anyo != null && datos_parada_mes_anyo != undefined) {
            datos_para_la_grafica.push({ 
                id: 'graph-parada-' + nombre_parada.toLowerCase().replace(/ /g, ''),
                parada: nombre_parada,
                cantidad: datos_parada_mes_anyo.num_pasajeros,
                clase: 'graph-bar'
            });
        }
    }

    return datos_para_la_grafica;
}

/**
 * Carga, de la variable global datos, los datos que vamos a utilizar en la gráfica mes año
 * Si no recibe valor de parada, sumará todos los números.
 * Si recibe valor de parada, se filtrará también por parada
 * @param {string} seleccion_parada texto con el nombre de la parada a cotejar
 * @returns array con los datos para la gráfica
 */
function cargarDatosGraficaMesAnyo(seleccion_parada) {
    let total_num_pasajeros = 0;
    let total_num_sin_pagar_escapados = 0;
    let total_num_sin_pagar_atrapados = 0;
    let total_num_revisores_subieron = 0;
    let total_num_incidentes = 0;

    let datos_para_la_grafica = []; // De entre todos los datos, obtenemos los que nos interesan
    for (let index in datos) { // Recorremos cada parada, recogiendo datos en base al año y mes seleccionados
        let datos_parada_mes_anyo = datos[index].filter((elm) => filtrarDatosGraficaMesAnyo(elm.anyo, elm.mes, elm.parada, seleccion_parada, 1))[0];
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
        tipo: 'Atrapados',
        cantidad: total_num_sin_pagar_atrapados,
        color: COLORES[2]
    });
    datos_para_la_grafica.push({ 
        id: 'graph-sin-pagar-escapados',
        tipo: 'Escapados',
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
function filtrarDatosGraficaMesAnyo(anyo, mes, parada, seleccion_parada, tipo) {
    if (tipo == 4) {
        return anyo == seleccion_anyo && parada == seleccion_parada;
    } if (tipo >= 1 && tipo <= 3) {
        if (seleccion_parada != undefined && seleccion_parada != null && seleccion_parada != '' && PARADAS.includes(seleccion_parada)) {
            return anyo == seleccion_anyo && mes == seleccion_mes && parada == seleccion_parada;
        } 
    }
    return anyo == seleccion_anyo && mes == seleccion_mes;
}
/** ----------------------------------------------------------------- */
/** ----------------------------------------------------------------- */


/** funciones: datos tiempo real */
setInterval(nuevosDatos, 5000);
function nuevosDatos() {
    let anyo_act = new Date().getFullYear();
    let mes_act = new Date().getMonth() + 1;
    for (let ind_arr in datos) {
        for (let ind_elm in datos[ind_arr]) {
            if (datos[ind_arr][ind_elm].anyo == anyo_act && datos[ind_arr][ind_elm].mes == mes_act) {
                let num_pasajeros_random = numeroRandom(0, 18);
                let num_revisores_random = numeroRandom(0, 2);
                let num_sinpa_atrapados_random = numeroRandom(0, 2);
                let num_sinpa_escapados_random = numeroRandom(0, 2);

                datos[ind_arr][ind_elm].num_pasajeros += num_pasajeros_random;
                datos[ind_arr][ind_elm].num_revisores_subieron += num_revisores_random;
                datos[ind_arr][ind_elm].num_sin_pagar_atrapados += num_sinpa_atrapados_random;
                datos[ind_arr][ind_elm].num_sin_pagar_escapados += num_sinpa_escapados_random;
    
                // Los incidentes serán algo muy poco común, si el número random devuelve 1, 
                //     tendrá un 5% de probabilidades de surgir
                let num_incidentes_random = numeroRandom(0, 1);
                if (num_incidentes_random > 0) { 
                    if (numeroRandom(1, 100) > 95) {
                        datos[ind_arr][ind_elm].num_incidentes += num_incidentes_random;
                        if (estilo_grafica == 5) { // Si es gráfica a cero para observar entrada datos, lo añadimos 
                            datos_grafica[4].cantidad += num_incidentes_random;
                        }
                    }
                }
                if (estilo_grafica == 5) { // Si es gráfica a cero para observar entrada datos, lo añadimos 
                    datos_grafica[0].cantidad += num_pasajeros_random;
                    datos_grafica[1].cantidad += num_revisores_random;
                    datos_grafica[2].cantidad += num_sinpa_atrapados_random;
                    datos_grafica[3].cantidad += num_sinpa_escapados_random;
                }
            }
        }
    }
    if (estilo_grafica != 5) {
        datos_grafica = cargarDatosGrafica(seleccion_parada);
    }
    actualizarGraficas();
}

function actualizarGraficas() { 
    switch(estilo_grafica) {
        case 1:
        case 2:
        case 5:
            svg.selectAll('rect')
                .data(datos_grafica)
                .transition()
                .duration(2000)
                .attr('width', calcularPorcentajaBarraGraficaMesAnyo);
            
            svg.selectAll('.legend-qt')
                .data(datos_grafica)
                .text((d, i) => {
                    if (datos_grafica[i].cantidad == 0) {
                        return 0;
                    } else {
                        if (i == 4 && datos_grafica[i].tipo == 'Incidentes') {
                            return datos_grafica[i].cantidad;
                        }
                        incrementaNumElemento(i);
                    }
                })
                .transition()
                .duration(2000)
                .attr('x', calcularPorcentajaBarraGraficaMesAnyo);
            break;
        case 3:
        case 4:
            svg.selectAll('rect')
                .data(datos_grafica)
                .transition()
                .duration(2000)
                .attr('width', calcularPorcentajaBarraGraficaMesAnyo);
            
            svg.selectAll('.legend-qt')
                .data(datos_grafica)
                .text((d, i) => datos_grafica[i].cantidad)
                .transition()
                .duration(2000)
                .attr('x', calcularPorcentajaBarraGraficaMesAnyo);
            break;
        default:
            break;
    }
}

/* Función que busca el elemento y le ejecuta la recursividad */
function incrementaNumElemento(index) {
    let elemento = document.getElementById(datos_grafica[index].id + '-qt');
    let numeroInicial = Number(elemento.innerHTML);
    let numeroFinal = datos_grafica[index].cantidad;

    if ((numeroFinal - numeroInicial) > 700) {
        numeroInicial = numeroFinal - 700;
    } else if (numeroFinal == 0 || (numeroFinal - numeroInicial) <= 0) {
        elemento.innerHTML = numeroFinal;
        return;
    }

    let velocidad = 20;
    incNumRec(numeroInicial, numeroFinal, elemento, velocidad);
}

/* Función recursiva para incrementar el número. */
function incNumRec(numeroInicial, numeroFinal, elemento, velocidad) {
    if (numeroInicial <= numeroFinal) {
        elemento.innerHTML = numeroInicial;
        setTimeout(function() { // Pequeño delay para la recursividad
            incNumRec(numeroInicial + 1, numeroFinal, elemento);
        }, velocidad);
    }
}


/**
 * TODO dani: 
 * 
 * BOTONES LARGE
 * - clicar el botón que corresponda (si viene de info será distinto que cargando la pestaña)
 * - animacion boton
 * - cambiar color si esta seleccionado o no
 * - afectar al mini
 * 
 * SELECT MINI
 * - cambiar color seleccion
 * - cargar las opciones del select spec por defecto
 * - cargar las opciones del select spec si viene de la pestaña info
 * - cargar las opciones del select spec si ha cambiado la opción del selector
 * - afectar a los botones
 */

document.getElementById('graph-selector').addEventListener('change', cambiarOpcionesSpecYseleccionarGrafica);
function cambiarOpcionesSpecYseleccionarGrafica(){
    cambiarOpcionesSpec();
    seleccionarGrafica();
}
function cambiarOpcionesSpec() {
    let graph_selector = document.getElementById('graph-selector');
    let graph_spec = document.getElementById('graph-spec');

    if (graph_selector.value == 1) {
        graph_spec.innerHTML = '<option value="1" selected>Datos de todas las paradas indicando año y mes</option>' + 
                               '<option value="2">Datos de una parada indicando año y mes</option>';
    } else if (graph_selector.value == 2) {
        graph_spec.innerHTML = '<option value="3" selected>Número de pasajeros por cada parada por año y mes</option>' + 
                               '<option value="4">Número de pasajeros por cada parada por año</option>';
    } else {
        graph_spec.innerHTML = '<option value="5" selected>Visualizar actualización de datos</option>'; 
    }
}

document.getElementById('graph-spec').addEventListener('change', seleccionarGrafica);
function seleccionarGrafica() {
    let graph_spec = document.getElementById('graph-spec');
    estilo_grafica = parseInt(graph_spec.value);
    let boton_seleccionado = document.getElementById('graph-selector-button-' + estilo_grafica);
    cambiarColorBotonSeleccionado(boton_seleccionado);
    datos_grafica = cargarDatosGrafica(seleccion_parada);
    pintarGrafica();
 
    // Si es la gráfica dos, mostramos la opción seleccionar mes
    if (estilo_grafica == 2) {
        document.getElementById('graph-selector-parada').classList.remove('display-none');
    } else { // Si no, lo ocultamos
        document.getElementById('graph-selector-parada').classList.add('display-none');
    }

    tituloGrafica();
    descripcionGrafica();
}

/** 
 * Utilizamos la delegación de eventos, añadimos el listener onclick al div que contiene los botones.
 * Después, en la función asignada al evento, comprobamos si estamos en efecto clicando dentro del botón (o 
 * dentro de cualquiera de sus elementos)
 * 
 * En la función provocaremos la animación de cambio de color y cambiaremos de gráfica.
 * Para que sea totalmente responsive, también cambiaremos el valor de los menús en versión display 'mini', para
 * que si el usuario modifica el tamaño después de haber seleccionado una u otra gráfica, se mantenga la correlación
 * entre la selección y lo que se está mostrando.
 */
document.getElementById('graph-selector-buttons-wrapper').addEventListener('click', efectoBotonSelectorGrafica);
function efectoBotonSelectorGrafica(evt) {
    let tag = evt.target.tagName;
    if (tag == 'BUTTON' || tag == 'B' || tag == 'P') {
        let boton_seleccionado;
        if (tag == 'B') {
            boton_seleccionado = evt.target.parentNode.parentNode;
        } else if (tag == 'P') {
            boton_seleccionado = evt.target.parentNode;
        } else {
            boton_seleccionado = evt.target;
        }

        // cambiarColorBotonSeleccionado(boton_seleccionado);

        estilo_grafica = parseInt(boton_seleccionado.value);
        if (estilo_grafica == 2 && seleccion_parada == undefined) {
            seleccion_parada = PARADAS[0];
        }

        let graph_mini_graph_selec = document.getElementById('graph-selector');
        let graph_mini_spec_selec = document.getElementById('graph-spec');

        switch(estilo_grafica) {
            case 1:
                graph_mini_graph_selec.value = 1;
                cambiarOpcionesSpec();
                graph_mini_spec_selec.value = 1;
                seleccionarGrafica();
                break;
            case 2:
                graph_mini_graph_selec.value = 1;
                cambiarOpcionesSpec();
                graph_mini_spec_selec.value = 2;
                seleccionarGrafica();
                break;
            case 3:
                graph_mini_graph_selec.value = 2;
                cambiarOpcionesSpec();
                graph_mini_spec_selec.value = 3;
                seleccionarGrafica();
                break;
            case 4:
                graph_mini_graph_selec.value = 2;
                cambiarOpcionesSpec();
                graph_mini_spec_selec.value = 4;
                seleccionarGrafica();
                break;
            case 5:
                graph_mini_graph_selec.value = 3;
                cambiarOpcionesSpec();
                graph_mini_spec_selec.value = 5;
                seleccionarGrafica();
                break;
        }
    }
}

/**
 * Quita la clase seleccionado a los demás botones y se la añade a él mismo
 * @param {element} boton_seleccionado botón al cual añadirle la clase seleccionado
 */
function cambiarColorBotonSeleccionado(boton_seleccionado) {
    let nombre_clase_selected = 'graph-selector-button-selected';

    // Animación de deseleccionar los demás botones (eliminar la clase)
    // Aunque solo debería existir uno, cogemos todos y lo ejecutamos en todos
    let botones_previamente_seleccionados = document.getElementsByClassName(nombre_clase_selected);
    if (botones_previamente_seleccionados.length > 0) {
        botones_previamente_seleccionados[0].classList.toggle(nombre_clase_selected)
    }

    // Añadimos la clase selected al botón clicado
    boton_seleccionado.classList.toggle(nombre_clase_selected);
}

/** Botones siguiente y anterior parada */
function siguienteParada() {
    index_parada++;
    if (index_parada >= PARADAS.length) {
        index_parada = 0;
    }

    seleccion_parada = PARADAS[index_parada];
    tituloParada();
    seleccionarGrafica();
}
function anteriorParada() {
    index_parada--;
    if (index_parada < 0) {
        index_parada = PARADAS.length - 1;
    }

    seleccion_parada = PARADAS[index_parada];
    tituloParada();
    seleccionarGrafica();
}

function tituloGrafica() {
    let titulo = TITULOS_GRAFICAS[estilo_grafica - 1];
    titulo = titulo.replace('{mes}', seleccion_mes);
    titulo = titulo.replace('{año}', seleccion_anyo);
    titulo = titulo.replace('{parada}', seleccion_parada);
    document.getElementById('graph-title').innerHTML = titulo;
}

function descripcionGrafica() {
    document.getElementById('graph-desc').innerHTML = DESC_GRAFICAS[estilo_grafica - 1];
}

function tituloParada() {
    document.getElementById('parada-title').innerHTML = seleccion_parada;
}

prepararPagina();
/** Prepara la página para cuando cargue (puede cargar en distintos estados) */
function prepararPagina() {
    tituloParada();
    document.getElementById('graph-selector-button-' + estilo_grafica).click();
}


/*
distancia()
function distancia() {
    let dist = 7500; // A la que queremos ir

    let dist_entre_paradas = 5000;

    let paradas = parseInt(dist / dist_entre_paradas);
    let resto = dist % dist_entre_paradas;

    console.log(paradas)
    console.log(resto)

    let max = 13.1875;
    let pos = (resto * max / 5000)

    let posIni = 2 + ((paradas - 1) * max);
    
    console.log(posIni + pos)
    
}*/