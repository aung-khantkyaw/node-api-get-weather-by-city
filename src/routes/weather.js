const { Router } = require("express");
const { getWeatherPayload } = require("../services/weatherService");

const router = Router();

router.get("/weather/:city", async (req, res) => {
  try {
    const weather = await getWeatherPayload(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(502).json({ detail: error.message });
  }
});

module.exports = router;
