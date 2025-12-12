const axios = require("axios");

// -------------------------------------------
// GEO: sugerencias de ciudades
// -------------------------------------------
exports.getGeoSuggestions = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const apiKey = process.env.OPENWEATHER_KEY;

    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        ciudad
      )}&limit=5&appid=${apiKey}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sugerencias" });
  }
};

// -------------------------------------------
// Clima actual
// -------------------------------------------
exports.getCurrentWeather = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const apiKey = process.env.OPENWEATHER_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        ciudad
      )}&appid=${apiKey}&units=metric&lang=es`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo clima actual" });
  }
};

// -------------------------------------------
// Pronóstico
// -------------------------------------------
exports.getForecast = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const apiKey = process.env.OPENWEATHER_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        ciudad
      )}&appid=${apiKey}&units=metric&lang=es`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo pronóstico" });
  }
};
