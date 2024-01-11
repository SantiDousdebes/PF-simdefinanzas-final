let sueldo = 0;
let gastos = [];
let descripcionGastos = [];
let metaAhorro = 0;

function calcularTiempo() {
  sueldo = parseFloat(document.getElementById('sueldo').value);
  gastos = document.getElementById('gastos').value.split(',');
  descripcionGastos = document.getElementById('descripcionGastos').value.split(',');
  metaAhorro = parseFloat(document.getElementById('metaAhorro').value);
  
  const totalGastos = gastos.reduce((acc, gasto) => acc + parseFloat(gasto), 0);
  const ahorroMensual = sueldo - totalGastos;
  const tiempoParaAhorro = metaAhorro / ahorroMensual;
  
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  const tiempoAhorroDiv = document.getElementById('tiempoParaAhorro');
  tiempoAhorroDiv.innerHTML = `Tardarás aproximadamente ${tiempoParaAhorro.toFixed(2)} meses en alcanzar tu meta de ahorro.`;

  // Actualiza la interfaz después de calcular el tiempo
  actualizarInterfaz();
}

function cargarDatos() {
  console.log('Cargando datos localmente...');
  fetch('datos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudieron cargar los datos.');
      }
      return response.json();
    })
    .then(data => {
      manipularDatos(data);
      console.log('Datos cargados localmente:', data);
      // Actualiza la interfaz después de cargar y manipular los datos
      actualizarInterfaz();
    })
    .catch(error => {
      console.error('Error de carga local:', error);
    });
}

function manipularDatos(data) {
  sueldo = data.sueldo;
  gastos = data.gastos;
  descripcionGastos = data.descripcionGastos;
  metaAhorro = data.metaAhorro;
}

function cargarDatosExternos() {
  console.log('Cargando datos externamente...');
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      manipularDatos(data);
      console.log('Datos cargados externamente:', data);
      // Actualiza la interfaz después de cargar y manipular los datos
      actualizarInterfaz();
    }
  };
  xhttp.open("GET", "https://ejemplo.com/api/datos", true);
  xhttp.send();
}

function generarTabla() {
  const tabla = document.createElement('table');
  const encabezado = tabla.createTHead();
  const filaEncabezado = encabezado.insertRow();
  const encabezados = ['Descripción', 'Gasto'];

  encabezados.forEach(encabezadoTexto => {
    const th = document.createElement('th');
    const texto = document.createTextNode(encabezadoTexto);
    th.appendChild(texto);
    filaEncabezado.appendChild(th);
  });

  const cuerpoTabla = document.createElement('tbody');

  for (let i = 0; i < gastos.length; i++) {
    const fila = cuerpoTabla.insertRow();
    const celdaDescripcion = fila.insertCell();
    const celdaGasto = fila.insertCell();

    const textoDescripcion = document.createTextNode(descripcionGastos[i]);
    const textoGasto = document.createTextNode(gastos[i]);

    celdaDescripcion.appendChild(textoDescripcion);
    celdaGasto.appendChild(textoGasto);
  }

  tabla.appendChild(cuerpoTabla);
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';
  resultado.appendChild(tabla);
}

function generarGrafico() {
  const ctx = document.getElementById('graficoCanvas').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: descripcionGastos,
      datasets: [{
        label: 'Gastos',
        data: gastos,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function actualizarInterfaz() {
  // Llama a funciones para actualizar la interfaz
  generarTabla();
  generarGrafico();
}

document.getElementById('calcularBtn').addEventListener('click', calcularTiempo);
window.addEventListener('load', cargarDatos);
cargarDatosExternos();
