const { Router } = require("express");

const healthRoute = require("./health");
const weatherRoute = require("./weather");

const router = Router();

router.use(healthRoute);
router.use(weatherRoute);

module.exports = router;
