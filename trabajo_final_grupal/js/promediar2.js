/**
 * Registro de notas de la Secretaría.
 * Valida tres notas (0 a 20), calcula el promedio y lo agrega a la tabla.
 * Aprueba con promedio mayor o igual a 12.5 (redondeo vigesimal: 13).
 */
const NOTA_MIN = 0;
const NOTA_MAX = 20;
const NOTA_APROBATORIA = 12.5;

function celda(texto) {
    const td = document.createElement('td');
    td.textContent = texto; // textContent evita inyectar HTML desde el formulario
    return td;
}

function leerNota(id) {
    const valor = document.getElementById(id).value.trim();
    if (valor === '') return { vacia: true };
    const numero = Number(valor);
    return { vacia: false, numero, valida: Number.isFinite(numero) && numero >= NOTA_MIN && numero <= NOTA_MAX };
}

function agregarNotas() {
    const inputNombre = document.getElementById('nombre');
    const nombre = inputNombre.value.trim();

    if (nombre === '') {
        swal('Ingrese el nombre del estudiante', 'El campo de nombre no puede estar vacío.', 'warning');
        inputNombre.focus();
        return false;
    }

    const ids = ['nota1', 'nota2', 'nota3'];
    const notas = ids.map(leerNota);

    if (notas.some(n => n.vacia)) {
        swal('Ingrese las tres notas', 'Ninguna nota puede quedar vacía.', 'warning');
        document.getElementById(ids[notas.findIndex(n => n.vacia)]).focus();
        return false;
    }
    if (notas.some(n => !n.valida)) {
        swal('Nota fuera de rango', `Cada nota debe estar entre ${NOTA_MIN} y ${NOTA_MAX}.`, 'error');
        document.getElementById(ids[notas.findIndex(n => !n.valida)]).focus();
        return false;
    }

    const valores = notas.map(n => n.numero);
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const aprobado = promedio >= NOTA_APROBATORIA;

    const fila = document.createElement('tr');
    fila.appendChild(celda(nombre));
    valores.forEach(v => {
        const td = celda(v);
        td.style.color = v >= NOTA_APROBATORIA ? '#1d4ed8' : '#dc2626';
        fila.appendChild(td);
    });

    const tdPromedio = celda(promedio.toFixed(1));
    tdPromedio.style.background = aprobado ? '#B3DEBA' : '#FFCABA';
    tdPromedio.style.fontWeight = '600';
    fila.appendChild(tdPromedio);
    fila.appendChild(celda(aprobado ? '¡Aprobado! ✔' : '¡Desaprobado! ❌'));

    document.getElementById('addtabla').appendChild(fila);

    swal('Nota registrada', `${nombre}: promedio ${promedio.toFixed(1)}`, aprobado ? 'success' : 'info');

    inputNombre.value = '';
    ids.forEach(id => { document.getElementById(id).value = ''; });
    inputNombre.focus();
    return true;
}
