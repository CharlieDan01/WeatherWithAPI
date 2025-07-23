const apiKey = 'fd37b22c7641c8b3017750bac83d6c57'; 

const inputCiudad = document.getElementById('ciudad');
const sugerenciasDiv = document.createElement('div');
sugerenciasDiv.id = 'sugerencias';
sugerenciasDiv.style.position = 'absolute';
sugerenciasDiv.style.background = '#fff';
sugerenciasDiv.style.border = '1px solid #ccc';
sugerenciasDiv.style.width = inputCiudad.offsetWidth + 'px';
sugerenciasDiv.style.zIndex = 1000;
inputCiudad.parentNode.appendChild(sugerenciasDiv);

inputCiudad.addEventListener('input', async () => {
  const query = inputCiudad.value.trim();
  if (query.length < 3) {
    sugerenciasDiv.innerHTML = '';
    return;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

  try {
    const resp = await fetch(url);
    const ciudades = await resp.json();
    console.log('Suggest:', ciudades); // 👈 para depurar
    mostrarSugerencias(ciudades);
  } catch (err) {
    console.error('Error al obtener sugerencias:', err);
  }
});


function mostrarSugerencias(ciudades) {
  sugerenciasDiv.innerHTML = '';
  if (ciudades.length === 0) return;

  ciudades.forEach((c) => {
    const opcion = document.createElement('div');
    opcion.style.padding = '0.5rem';
    opcion.style.cursor = 'pointer';
    opcion.textContent = `${c.name}, ${c.country}`;
    opcion.addEventListener('click', () => {
      inputCiudad.value = `${c.name}, ${c.country}`;
      sugerenciasDiv.innerHTML = '';
      obtenerClimaPorCoords(c.lat, c.lon, c.name); // Usar coordenadas exactas
    });
    sugerenciasDiv.appendChild(opcion);
  });
}

// Para consumir clima por coordenadas (llamada desde el geocoding)
async function obtenerClimaPorCoords(lat, lon, nombreCiudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("No se pudo obtener el clima");
    const data = await resp.json();

    const temp = data.main.temp;
    const sensacion = data.main.feels_like;
    const clima = data.weather[0].description;

    document.getElementById('resultado').innerHTML = `
      <strong>${nombreCiudad.toUpperCase()}</strong><br>
      Temperature: ${temp}°C<br>
      Thermal sensation: ${sensacion}°C<br>
      Weather: ${clima}
    `;
  } catch (err) {
    document.getElementById('resultado').innerText = 'Error: ' + err.message;
  }
}
