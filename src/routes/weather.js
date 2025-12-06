const { Router } = require("express");
const { getWeatherPayload } = require("../services/weatherService");

const router = Router();

router.get("/v2/weather", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({
      detail: "Query parameters 'lat' and 'lon' must be provided as numbers.",
    });
  }

  try {
    const weather = await getWeatherPayload(req.query.city, {
      lat,
      lon,
      label: req.query.label || req.query.city,
    });
    res.json(weather);
  } catch (error) {
    res.status(502).json({ detail: error.message });
  }
});

router.get("/v2/weather/:city", async (req, res) => {
  try {
    const weather = await getWeatherPayload(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(502).json({ detail: error.message });
  }
});

router.get("/v1/weather/:city", async (req, res) => {
  try {
    const weather = await getWeatherPayload(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(502).json({ detail: error.message });
  }
});

module.exports = router;
