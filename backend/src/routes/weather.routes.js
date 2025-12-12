const express = require("express");
const router = express.Router();
const {
  getGeoSuggestions,
  getCurrentWeather,
  getForecast,
} = require("../controllers/weather.controller");

// Autocompletado
router.get("/geo", getGeoSuggestions);

// Clima
router.get("/clima", getCurrentWeather);

// Pronóstico
router.get("/forecast", getForecast);

module.exports = router;
