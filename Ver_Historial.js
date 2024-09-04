document.addEventListener('DOMContentLoaded', () => {
    const tablaHistorial = document.querySelector('#tabla-historial tbody');
    const botonVolver = document.getElementById('volver');

    // Obtener datos del localStorage
    function obtenerDatos() {
        const datos = localStorage.getItem('vehiculos');
        return datos ? JSON.parse(datos) : [];
    }

    // Guardar datos en el localStorage
    function guardarDatos(datos) {
        localStorage.setItem('vehiculos', JSON.stringify(datos));
    }

    // Actualizar historial
    function actualizarHistorial() {
        const vehiculos = obtenerDatos();
        let html = '';

        vehiculos.forEach((vehiculo, index) => {
            if (vehiculo.salida) {
                const entrada = new Date(vehiculo.entrada).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                const salida = new Date(vehiculo.salida).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                html += `
                    <tr data-index="${index}">
                        <td>${vehiculo.placa}</td>
                        <td>${vehiculo.tipo}</td>
                        <td>${entrada}</td>
                        <td>${salida}</td>
                        <td>${vehiculo.espacio}</td>
                        <td>${vehiculo.costo}</td>
                        <td><button class="eliminar">Eliminar</button></td> <!-- Botón para eliminar -->
                    </tr>
                `;
            }
        });

        tablaHistorial.innerHTML = html;
    }

    
    tablaHistorial.addEventListener('click', (event) => {
        if (event.target.classList.contains('eliminar')) {
            const fila = event.target.closest('tr');
            const index = fila.dataset.index;
            eliminarVehiculo(index);
        }
    });

   
    function eliminarVehiculo(index) {
        let vehiculos = obtenerDatos();
        vehiculos.splice(index, 1); 
        guardarDatos(vehiculos); 
        actualizarHistorial(); 
    }

    
    botonVolver.addEventListener('click', () => {
        window.location.href = 'Registrar_Vehiculo.html'; 
    });

    actualizarHistorial();
});