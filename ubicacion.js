function obtenerUbicacion() {
    if (navigator.geolocation) {
        // Ponemos el spinner animado mientras se espera a la API
        document.getElementById("demo").innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p class="placeholder-text">Sincronizando datos de Ciudad Real...</p>
            </div>
        `;
        navigator.geolocation.getCurrentPosition(mostrarUbicacion, manejarError);
    } else {
        document.getElementById("demo").innerHTML = "<p class='placeholder-text'>La geolocalización no es soportada por este navegador.</p>";
    }
}

async function mostrarUbicacion(position) {
    const lat = 38.9833;
    const lon = -3.9167;
    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=622f5664443790c91a6fbe9b38cadbf6&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al conectar con la API");
        const datos = await response.json();
        
        const tempActual = Math.round(datos.main.temp);
        const tempMin = Math.round(datos.main.temp_min);
        const tempMax = Math.round(datos.main.temp_max);
        const desc = datos.weather[0].description;

        // Envolvemos todo en un contenedor con "animacion-entrada" para que aparezca suavemente
        document.getElementById("demo").innerHTML = `
            <div class="animacion-entrada">
                <div class="weather-header">
                    <h1>${datos.name}</h1>
                    <div style="font-size: 20px; opacity: 0.8;">⋮⚙️</div>
                </div>

                <div class="main-temp">${tempActual}°</div>
                <div class="weather-desc">
                    ${desc.charAt(0).toUpperCase() + desc.slice(1)} ${tempMin}° / ${tempMax}°<br>
                    Calidad del aire: entre 26 y Good
                </div>

                <div class="weather-card aqi-container">
                    <div class="aqi-info">
                        <h4>💨 Viento y Humedad</h4>
                        <p>Velocidad del viento: <strong>${datos.wind.speed} m/s</strong><br>
                        Humedad en el ambiente: <strong>${datos.main.humidity}%</strong></p>
                    </div>
                    <div class="aqi-badge">26</div>
                </div>

                <div class="weather-card hourly-flex">
                    <div class="hourly-item">
                        <span class="time">Ahora</span><span>☀️</span><span class="temp">${tempActual}°</span>
                    </div>
                    <div class="hourly-item">
                        <span class="time">14:00</span><span>☀️</span><span class="temp">${tempMax}°</span>
                    </div>
                    <div class="hourly-item">
                        <span class="time">17:00</span><span>☀️</span><span class="temp">${tempMax}°</span>
                    </div>
                    <div class="hourly-item">
                        <span class="time">20:00</span><span>☁️</span><span class="temp">${tempActual - 2}°</span>
                    </div>
                    <div class="hourly-item">
                        <span class="time">23:00</span><span>🌙</span><span class="temp">${tempMin}°</span>
                    </div>
                </div>

                <div class="weather-card">
                    <h5 class="daily-title">Pronóstico para varios días</h5>
                    <div class="daily-row">
                        <span class="daily-day">Hoy</span><span>☀️</span>
                        <span class="daily-range">${tempMin}° / ${tempMax}°</span>
                    </div>
                    <div class="daily-row">
                        <span class="daily-day">Mañana</span><span>☁️</span>
                        <span class="daily-range">${tempMin - 1}° / ${tempMax + 1}°</span>
                    </div>
                    <div class="daily-row">
                        <span class="daily-day">Domingo</span><span>☀️</span>
                        <span class="daily-range">${tempMin}° / ${tempMax + 3}°</span>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        document.getElementById("demo").innerHTML = `
            <p class="placeholder-text" style="color: #ef4444;">⚠️ Error al cargar los datos.</p>
        `;
        console.error(error);
    }
}

function manejarError(error) {
    mostrarUbicacion(null);
}