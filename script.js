const btnAgregar = document.getElementById('btn-agregar');
const listaParciales = document.getElementById('lista-parciales');
const sumaPorcentajes = document.getElementById('suma-porcentajes');

const notaMinimaResultado = document.getElementById('nota-minima-resultado');
const notaDeseadaResultado = document.getElementById('nota-deseada-resultado');
const promedioAcumulado = document.getElementById('promedio-acumulado');
const notaMinimaPosible = document.getElementById('nota-minima-posible');

function actualizarSumaMostrada() {
    let suma = 0;
    const inputs = document.querySelectorAll('.input-porcentaje');
    inputs.forEach(input => {
        suma += parseFloat(input.value) || 0;
    });
    sumaPorcentajes.textContent = 'acumulado: ' + suma + '%';
}

function crearFilaParcial() {
    const div = document.createElement('div');
    div.className = 'fila-parcial';

    const labelNota = document.createElement('label');
    labelNota.textContent = 'Nota:';

    const inputNota = document.createElement('input');
    inputNota.type = 'number';
    inputNota.className = 'input-nota';
    inputNota.step = '0.1';
    inputNota.min = '0';
    inputNota.max = '5';
    inputNota.placeholder = '3.5';

    const labelPorcentaje = document.createElement('label');
    labelPorcentaje.textContent = 'Porcentaje:';

    const inputPorcentaje = document.createElement('input');
    inputPorcentaje.type = 'number';
    inputPorcentaje.className = 'input-porcentaje';
    inputPorcentaje.min = '1';
    inputPorcentaje.max = '100';
    inputPorcentaje.placeholder = '20';

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';

    btnEliminar.addEventListener('click', function() {
        div.remove();
        actualizarSumaMostrada();
        revisarSumaTotal();
    });

    inputPorcentaje.addEventListener('input', function() {
    validarPorcentaje(inputPorcentaje);
    actualizarSumaMostrada();
    revisarSumaTotal();
});

    const grupoNota = document.createElement('span');
    grupoNota.className = 'grupo-campo';
    grupoNota.appendChild(labelNota);
    grupoNota.appendChild(inputNota);

    const grupoPorcentaje = document.createElement('span');
    grupoPorcentaje.className = 'grupo-campo';
    grupoPorcentaje.appendChild(labelPorcentaje);
    grupoPorcentaje.appendChild(inputPorcentaje);
    grupoPorcentaje.appendChild(btnEliminar);

    div.appendChild(grupoNota);
    div.appendChild(grupoPorcentaje);

    const totalFilas = document.querySelectorAll('.fila-parcial').length;
    if (totalFilas > 0) {
        labelNota.style.display = 'none';
        labelPorcentaje.style.display = 'none';
    }

    return div;
}

function validarPorcentaje(input) {
    let valor = parseFloat(input.value);
    
    if (isNaN(valor)) {
        return;
    }
    
    if (valor < 0) {
        input.value = 0;
    } else if (valor > 100) {
        input.value = 100;
    }
}

function revisarSumaTotal() {
    let suma = 0;
    const inputs = document.querySelectorAll('.input-porcentaje');
    
    inputs.forEach(input => {
        suma += parseFloat(input.value) || 0;
    });
    
    if (suma > 100) {
        inputs.forEach(input => {
            input.style.border = '2px solid red';
        });
        return false;
    } else {
        inputs.forEach(input => {
            input.style.border = '';
        });
        return true;
    }
}

//calculos para el resultado
function obtenerDatos() {
    const inputsNota = document.querySelectorAll('.input-nota');
    const inputsPorcentaje = document.querySelectorAll('.input-porcentaje');
    
    let sumaNotasPonderadas = 0;
    let sumaPorcentajes = 0;
    
    for (let i = 0; i < inputsNota.length; i++) {
        const nota = parseFloat(inputsNota[i].value);
        const porcentaje = parseFloat(inputsPorcentaje[i].value);
        
        if (!isNaN(nota) && !isNaN(porcentaje)) {
            sumaNotasPonderadas = sumaNotasPonderadas + (nota * porcentaje);
            sumaPorcentajes = sumaPorcentajes + porcentaje;
        }
    }
    
    return {
        sumaNotasPonderadas: sumaNotasPonderadas,
        sumaPorcentajes: sumaPorcentajes,
        porcentajeRestante: 100 - sumaPorcentajes
    };
}

function calcularPromedioAcumulado() {
    const datos = obtenerDatos();
    
    if (datos.sumaPorcentajes === 0) {
        promedioAcumulado.textContent = 'Promedio acumulado: --';
        return;
    }
    
    const promedio = datos.sumaNotasPonderadas / datos.sumaPorcentajes;
    promedioAcumulado.innerHTML = '<strong>Promedio acumulado:</strong> ' + promedio.toFixed(2);
}

function calcularNotaFinalAcumulada() {
    const datos = obtenerDatos();
    
    if (datos.sumaPorcentajes === 0) {
        notaMinimaPosible.textContent = 'Nota final acumulada: --';
        return;
    }
    
    const notaFinal = datos.sumaNotasPonderadas / 100;
    notaMinimaPosible.innerHTML = '<strong>Nota final acumulada:</strong> ' + notaFinal.toFixed(2);
}

function calcularNotaMinima() {
    const datos = obtenerDatos();
    const NOTA_APROBACION = 3.0;
    
    if (datos.sumaPorcentajes === 0) {
        notaMinimaResultado.textContent = 'Nota final mínima: --';
        return;
    }
    
    if (datos.porcentajeRestante === 0) {
        const notaFinal = datos.sumaNotasPonderadas / 100;
        if (notaFinal >= NOTA_APROBACION) {
            notaMinimaResultado.innerHTML = '<strong>Nota final mínima:</strong> Ya aprobaste';
        } else {
            notaMinimaResultado.innerHTML = '<strong>Nota final mínima:</strong> Ya perdiste';
        }
        return;
    }
    
    const notaNecesaria = (NOTA_APROBACION * 100 - datos.sumaNotasPonderadas) / datos.porcentajeRestante;
    
    if (notaNecesaria <= 0) {
        notaMinimaResultado.innerHTML = '<strong>Nota final mínima:</strong> Ya aprobaste';
    } else if (notaNecesaria > 5) {
        notaMinimaResultado.innerHTML = '<strong>Nota final mínima:</strong> Imposible (' + notaNecesaria.toFixed(1) + ')';
    } else {
        notaMinimaResultado.innerHTML = '<strong>Nota final mínima:</strong> ' + notaNecesaria.toFixed(1);
    }
}
function calcularNotaRecomendada() {
    const datos = obtenerDatos();
    
    if (datos.sumaPorcentajes === 0 || datos.porcentajeRestante === 0) {
        notaDeseadaResultado.innerHTML = '<strong>Nota recomendada:</strong> --';
        return;
    }
    
    const textoNotaMinima = notaMinimaResultado.textContent;
    const notaNecesaria = parseFloat(textoNotaMinima.replace('Nota final mínima: ', ''));
    
    if (isNaN(notaNecesaria)) {
        notaDeseadaResultado.innerHTML = '<strong>Nota recomendada:</strong> no aplica';
        return;
    }
    
    let incremento;
    
    if (notaNecesaria <= 3.5) {
        incremento = 1.5;
    } else if (notaNecesaria < 4.0) {
        incremento = 1.0;
    } else if (notaNecesaria < 4.5) {
        incremento = 0.5;
    } else {
        notaDeseadaResultado.innerHTML = '<strong>Nota recomendada:</strong> Mucha suerte, necesitas 5.0';
        return;
    }
    
    const notaRecomendada = notaNecesaria + incremento;
    
    if (notaRecomendada > 5) {
        notaDeseadaResultado.innerHTML = '<strong>Nota recomendada:</strong> Mucha suerte, necesitas 5.0';
    } else {
        notaDeseadaResultado.innerHTML = '<strong>Nota recomendada:</strong> ' + notaRecomendada.toFixed(1);
    }
}
// Función para mostrar un mensaje basado en la nota mínima necesaria
function mostrarMensaje() {
    const datos = {
        sumaNotasPonderadas: 0,
        sumaPorcentajes: 0
    };
    
    const inputsNota = document.querySelectorAll('.input-nota');
    const inputsPorcentaje = document.querySelectorAll('.input-porcentaje');
    
    for (let i = 0; i < inputsNota.length; i++) {
        const nota = parseFloat(inputsNota[i].value);
        const porcentaje = parseFloat(inputsPorcentaje[i].value);
        if (!isNaN(nota) && !isNaN(porcentaje)) {
            datos.sumaNotasPonderadas += nota * porcentaje;
            datos.sumaPorcentajes += porcentaje;
        }
    }
    
    if (datos.sumaPorcentajes === 0 || datos.sumaPorcentajes === 100) {
        mostrarPopUp('Completa los datos de las notas parciales.');
        return;
    }
    
    const porcentajeRestante = 100 - datos.sumaPorcentajes;
    const notaNecesaria = (3.0 * 100 - datos.sumaNotasPonderadas) / porcentajeRestante;
    
    let mensaje;
    if (notaNecesaria <= 0) {
        mensaje = 'Ya tienes la materia ganada, relájate.';
    } else if (notaNecesaria <= 2.5) {
        mensaje = 'Vas muy bien, con un esfuerzo mínimo apruebas.';
    } else if (notaNecesaria <= 3.5) {
        mensaje = 'Necesitas un buen resultado, pero es alcanzable.';
    } else if (notaNecesaria <= 4.5) {
        mensaje = 'Está difícil, estudia bastante.';
    } else if (notaNecesaria <= 5) {
        mensaje = 'Estás en zona de riesgo, necesitas casi todo perfecto.';
    } else {
        mensaje = 'Ya perdiste la materia.';
    }
    
    mostrarPopUp(mensaje);
}

btnAgregar.addEventListener('click', function() {
    const fila = crearFilaParcial();
    listaParciales.appendChild(fila);
    actualizarSumaMostrada();
});

const btnCalcular = document.getElementById('btn-calcular');

btnCalcular.addEventListener('click', function() {
    calcularPromedioAcumulado();
    calcularNotaFinalAcumulada();
    calcularNotaMinima();
    calcularNotaRecomendada();
    mostrarMensaje();
});

const filaInicial = crearFilaParcial();
listaParciales.appendChild(filaInicial);
actualizarSumaMostrada();

notaMinimaResultado.addEventListener('click', function() {
    mostrarPopUp('Es la nota que debes sacar en el porcentaje restante para alcanzar justo el 3.0 y aprobar la materia.');
});

notaDeseadaResultado.addEventListener('click', function() {
    mostrarPopUp('Es la nota a la que deberías apuntar en lo que falta para tener un margen de seguridad. No te conformes con el mínimo.');
});

promedioAcumulado.addEventListener('click', function() {
    mostrarPopUp('Es tu promedio actual considerando solo las notas que ya tienes y sus respectivos porcentajes.');
});

notaMinimaPosible.addEventListener('click', function() {
    mostrarPopUp('Es la nota final que obtendrías si sacaras 0 en todo lo que falta.');
});