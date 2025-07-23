console.log('Hola');
// Clima desde nombre de ciudad (para botón Buscar)
async function obtenerClimaPorCiudad(nombreCiudad) {
  const urlGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${nombreCiudad}&limit=1&appid=${apiKey}`;

  try {
    const respGeo = await fetch(urlGeo);
    const dataGeo = await respGeo.json();
    if (!dataGeo.length) throw new Error("City not found");

    const { lat, lon, name } = dataGeo[0];
    obtenerClimaPorCoords(lat, lon, name);
    //console.log('Hola');
  } catch (err) {
    document.getElementById('resultado').innerText = 'Error: ' + err.message;
  }
}

// Clima desde coordenadas (para autocompletado o geocoding)
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
    //console.log('adios');
  } catch (err) {
    document.getElementById('resultado').innerText = 'Error: ' + err.message;
  }
}

