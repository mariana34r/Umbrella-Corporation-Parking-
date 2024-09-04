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
            const horaSalida = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
            const entrada = new Date(vehiculo.entrada);
            const salida = new Date();
            const diferenciaMinutos = Math.ceil((salida - entrada) / (1000 * 60)); 

            vehiculo.salida = horaSalida;
            vehiculo.costo = diferenciaMinutos * tarifas[vehiculo.tipo];

            guardarDatos(vehiculos);
            actualizarTabla();
            alert(`El costo final del parqueo es: ${vehiculo.costo} (Por ${diferenciaMinutos} minutos)`);
        } else {
            alert('El vehículo no está registrado o ya ha salido.');
        }
    };


    botonVolver.addEventListener('click', () => {

        alert('Volviendo a Registrar Vehiculo');
    });

    actualizarTabla();
});