const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas correctas para tu frontend
app.use("/api", weatherRoutes);

module.exports = app;
