document.addEventListener('DOMContentLoaded', () => {
    const formularioEntrada = document.getElementById('form-entrada');
    const tablaVehiculos = document.getElementById('tabla-vehiculos');
    const tablaHistorial = document.querySelector('#tabla-historial tbody');
    const botonVerHistorial = document.getElementById('ver-historial');

    const tarifas = {
        'Moto': 1000,      // tarifa por minuto
        'Automóvil': 2000, // tarifa por minuto
        'Camioneta': 3000  // tarifa por minuto
    };

    // Obtener datos del localStorage
    function obtenerDatos() {
        const datos = localStorage.getItem('vehiculos');
        return datos ? JSON.parse(datos) : [];
    }

    // Guardar datos en el localStorage
    function guardarDatos(datos) {
        localStorage.setItem('vehiculos', JSON.stringify(datos));
    }

    // Actualizar la tabla de vehículos
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

    // Validar formato de placa
    function validarPlaca(placa) {
        const regex = /^[A-Z]{3}-\d{3}$/;
        return regex.test(placa);
    }

    // Validar que el espacio sea un número positivo hasta 100
    function validarEspacio(espacio) {
        const numero = parseInt(espacio, 10);
        return Number.isInteger(numero) && numero > 0 && numero <= 100;
    }

    // Registrar entrada
    function registrarEntrada(evento) {
        evento.preventDefault();
        const placa = document.getElementById('placa').value;
        const tipo = document.getElementById('tipo').value;
        const espacio = document.getElementById('espacio').value;
        const horaEntrada = document.getElementById('hora-entrada').value || new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }); // Usar hora actual si no se proporciona

        if (!placa || !tipo || !espacio) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (!validarPlaca(placa)) {
            alert('Formato de placa incorrecto. Debe ser AAA-123.');
            return;
        }

        if (!validarEspacio(espacio)) {
            alert('El espacio debe ser un número positivo entre 1 y 100.');
            return;
        }

        const vehiculos = obtenerDatos();
        const espacioOcupado = vehiculos.some(v => v.espacio === espacio && !v.salida);
        const placaExistente = vehiculos.some(v => v.placa === placa && !v.salida);

        if (espacioOcupado) {
            alert('El espacio ya está ocupado.');
            return;
        }

        if (placaExistente) {
            alert('La placa ya está registrada.');
            return;
        }

        const vehiculo = {
            placa,
            tipo,
            entrada: horaEntrada,
            espacio
        };

        vehiculos.push(vehiculo);
        guardarDatos(vehiculos);
        actualizarTabla();
        formularioEntrada.reset();
    }

    // Registrar salida
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
            actualizarHistorial();
            alert(`El costo final del parqueo es: ${vehiculo.costo} (Por ${diferenciaMinutos} minutos)`);
        } else {
            alert('El vehículo no está registrado o ya ha salido.');
        }
    };

    // Actualizar historial
    function actualizarHistorial() {
        const vehiculos = obtenerDatos();
        let html = '';

        vehiculos.forEach(vehiculo => {
            if (vehiculo.salida) {
                const entrada = new Date(vehiculo.entrada).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                const salida = new Date(vehiculo.salida).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                html += `
                    <tr>
                        <td>${vehiculo.placa}</td>
                        <td>${vehiculo.tipo}</td>
                        <td>${entrada}</td>
                        <td>${salida}</td>
                        <td>${vehiculo.espacio}</td>
                        <td>${vehiculo.costo}</td>
                    </tr>
                `;
            }
        });

        tablaHistorial.innerHTML = html;
    }

    formularioEntrada.addEventListener('submit', registrarEntrada);
    botonVerHistorial.addEventListener('click', actualizarHistorial);

    actualizarTabla();
});