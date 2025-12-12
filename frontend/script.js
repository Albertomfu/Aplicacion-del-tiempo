/***************************************************
  ELEMENTOS DOM
****************************************************/
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const suggestionsDiv = document.getElementById("suggestions");
const weatherResult = document.getElementById("weather-result");
const forecastDiv = document.getElementById("forecast");
const themeToggle = document.getElementById("theme-toggle");
const yearSpan = document.getElementById("year");

yearSpan.textContent = new Date().getFullYear();

/***************************************************
  TEMA DARK/LIGHT
****************************************************/
(function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
})();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.innerHTML =
    theme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
}

/***************************************************
  SUGERENCIAS AUTOMÁTICAS (desde tu backend)
****************************************************/
cityInput.addEventListener(
  "input",
  debounce(async (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.style.display = "none";
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/geo?ciudad=${encodeURIComponent(query)}`
      );

      const data = await response.json();
      renderSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  }, 350)
);

function renderSuggestions(list) {
  suggestionsDiv.innerHTML = "";

  if (!list.length) {
    suggestionsDiv.style.display = "none";
    return;
  }

  list.forEach((city) => {
    const suggestion = document.createElement("div");
    suggestion.className = "suggestion";
    suggestion.textContent = `${city.name}, ${city.country}`;
    suggestion.addEventListener("click", () => {
      cityInput.value = city.name;
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.style.display = "none";
      fetchWeatherByCoords(city.lat, city.lon, city.name, city.country);
    });
    suggestionsDiv.appendChild(suggestion);
  });

  suggestionsDiv.style.display = "block";
}

/***************************************************
  BUSCAR CLIMA
****************************************************/
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Por favor, escribe una ciudad.");
  fetchWeatherByName(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

/***************************************************
  FETCH POR NOMBRE (contra backend)
****************************************************/
async function fetchWeatherByName(city) {
  try {
    const r = await fetch(
      `http://localhost:3000/api/clima?ciudad=${encodeURIComponent(city)}`
    );

    if (!r.ok) throw new Error("Ciudad no encontrada");

    const data = await r.json();
    displayWeather(data);

    const f = await fetch(
      `http://localhost:3000/api/forecast?ciudad=${encodeURIComponent(city)}`
    );

    const fData = await f.json();
    displayForecast(fData.list);
  } catch (err) {
    alert(err.message);
  }
}

/***************************************************
  FETCH POR COORDENADAS (contra backend)
****************************************************/
async function fetchWeatherByCoords(lat, lon, name, country) {
  try {
    const r = await fetch(
      `/api/coords?lat=${lat}&lon=${lon}&name=${name}&country=${country}`
    );

    const data = await r.json();

    displayWeather(data.clima);
    displayForecast(data.pronostico);
  } catch (err) {
    console.error(err);
  }
}

/***************************************************
  MOSTRAR CLIMA ACTUAL
****************************************************/
function displayWeather(data) {
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  weatherResult.innerHTML = `
    <div class="weather-card-left glass">
      <img src="${iconUrl}" alt="${data.weather[0].description}">
      <div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${Math.round(data.main.temp)}°C — ${data.weather[0].description}</p>
        <p>Humedad: ${data.main.humidity}% • Viento: ${data.wind.speed} m/s</p>
      </div>
    </div>
  `;
}

/***************************************************
  MOSTRAR PRONÓSTICO
****************************************************/
function displayForecast(list) {
  forecastDiv.innerHTML = "";
  if (!list) return;

  const groups = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });

  for (const [day, items] of Object.entries(groups)) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "forecast-day glass";

    dayDiv.innerHTML = `<h4>${day}</h4>`;

    items.slice(0, 6).forEach((it) => {
      const time = new Date(it.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const iconUrl = `https://openweathermap.org/img/wn/${it.weather[0].icon}@2x.png`;

      dayDiv.innerHTML += `
        <div class="hourly-forecast">
          <p>${time}</p>
          <img src="${iconUrl}">
          <p>${Math.round(it.main.temp)}°C</p>
          <small>${it.weather[0].description}</small>
        </div>
      `;
    });

    forecastDiv.appendChild(dayDiv);
  }
}

/***************************************************
  UTILIDADES
****************************************************/
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/***************************************************
  COOKIE BANNER
****************************************************/
const cookieBanner = document.getElementById("cookie-banner");
const acceptButton = document.getElementById("accept-cookies");
const cancelButton = document.getElementById("cancel-cookies");

if (!localStorage.getItem("cookiesAccepted")) {
  cookieBanner.style.display = "block";
}

acceptButton.addEventListener("click", () => {
  localStorage.setItem("cookiesAccepted", "true");
  cookieBanner.style.display = "none";
});

cancelButton.addEventListener("click", () => {
  cookieBanner.style.display = "none";
});
