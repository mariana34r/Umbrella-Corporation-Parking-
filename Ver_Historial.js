document.addEventListener('DOMContentLoaded', () => {
    const tablaVehiculos = document.getElementById('tabla-vehiculos');
    const botonVolver = document.getElementById('volver');

    const tarifas = {
        'Moto': 1000,      
        'Automóvil': 2000, 
        'Camioneta': 3000  
    };

   
    function obtenerDatos() {
        const datos = localStorage.getItem('vehiculos');
        return datos ? JSON.parse(datos) : [];
    }

  
    function guardarDatos(datos) {
        localStorage.setItem('vehiculos', JSON.stringify(datos));
    }


    function actualizarTabla() {
        const vehiculos = obtenerDatos();
        let html = '';

        vehiculos.forEach(vehiculo => {
            if (!vehiculo.salida) { 
                const entrada = new Date(vehiculo.entrada).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                html += `
                    <tr class="${vehiculo.espacio ? 'fila-hover' : ''}">
                        <td>${vehiculo.placa}</td>
                        <td>${vehiculo.tipo}</td>
                        <td>${entrada}</td>
                        <td>${vehiculo.espacio}</td>
                        <td><button onclick="registrarSalida('${vehiculo.placa}')">Registrar Salida</button></td>
                    </tr>
                `;
            }
        });

        tablaVehiculos.querySelector('tbody').innerHTML = html;
    }


    window.registrarSalida = function(placa) {
        const vehiculos = obtenerDatos();
        const vehiculo = vehiculos.find(v => v.placa === placa && !v.salida);

        if (vehiculo) {
            const horaSalida = new Date(); 
            const entrada = new Date(vehiculo.entrada);
            const salida = horaSalida;
            const diferenciaMs = salida - entrada; 

            if (diferenciaMs < 60000) {
                vehiculo.salida = horaSalida.toISOString(); 
                vehiculo.costo = 0;
            } else {
                const diferenciaMinutos = Math.floor(diferenciaMs / 60000); 
                vehiculo.salida = horaSalida.toISOString(); 
                vehiculo.costo = diferenciaMinutos * tarifas[vehiculo.tipo]; 
            }

            guardarDatos(vehiculos);
            actualizarTabla();
            alert(`El costo final del parqueo es: ${vehiculo.costo} (Por ${Math.floor(diferenciaMs / 60000)} minutos)`);
        } else {
            alert('El vehículo no está registrado o ya ha salido.');
        }
    };

    botonVolver.addEventListener('click', () => {
        alert('Volviendo a Registrar Vehiculo');
    });

    actualizarTabla();
});


document.addEventListener('DOMContentLoaded', () => {
    const tablaHistorial = document.querySelector('#tabla-historial tbody');
    const botonVolver = document.getElementById('volver');


    function obtenerDatos() {
        const datos = localStorage.getItem('vehiculos');
        return datos ? JSON.parse(datos) : [];
    }

  
    function guardarDatos(datos) {
        localStorage.setItem('vehiculos', JSON.stringify(datos));
    }

 
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
