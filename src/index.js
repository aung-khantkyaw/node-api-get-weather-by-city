const app = require("./app");
const { getWeatherPayload } = require("./services/weatherService");

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    const userQuery = args.join(" ").trim();
    getWeatherPayload(userQuery)
      .then((result) => console.log(result))
      .catch((error) => console.log({ error: error.message }));
  } else {
    app.listen(PORT, () => {
      console.log(`Weather API running on port ${PORT}`);
    });
  }
}

module.exports = app;
