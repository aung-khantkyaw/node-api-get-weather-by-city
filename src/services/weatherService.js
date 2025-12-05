const axios = require("axios");

const DEFAULT_CITY = "Maubin";

function buildMockForecast(now = new Date()) {
  return Array.from({ length: 8 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + index);
    return {
      day: date.toLocaleDateString("en", { weekday: "short" }),
      high: (32 - index).toString(),
      low: (24 - (index % 3)).toString(),
    };
  });
}

function buildMockHourly() {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    temp: (26 + (hour % 8)).toString(),
  }));
}

async function getWeatherPayload(rawCity) {
  const city = rawCity?.trim() || DEFAULT_CITY;

  try {
    const geoResp = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: { name: city, count: 1 },
        timeout: 10000,
      }
    );

    if (!geoResp.data.results?.length) {
      throw new Error(`City '${city}' not found`);
    }

    const result = geoResp.data.results[0];
    const { latitude: lat, longitude: lon } = result;

    const weatherResp = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lon,
          current:
            "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
          hourly: "temperature_2m",
          daily: "temperature_2m_max,temperature_2m_min,weather_code",
          timezone: "auto",
          forecast_days: 8,
        },
        timeout: 10000,
      }
    );

    const data = weatherResp.data;
    const current = data.current;

    return {
      source: "open-meteo",
      current: {
        temperature: Math.round(current.temperature_2m).toString(),
        location: result.name,
        humidity: `${current.relative_humidity_2m}%`,
        wind: `${current.wind_speed_10m} km/h`,
        unit: "Celsius",
      },
      forecast: data.daily.time.slice(0, 8).map((time, index) => ({
        day: new Date(time).toLocaleDateString("en", { weekday: "short" }),
        high: Math.round(data.daily.temperature_2m_max[index]).toString(),
        low: Math.round(data.daily.temperature_2m_min[index]).toString(),
      })),
      hourly: data.hourly.time.slice(0, 24).map((time, index) => ({
        hour: time.split("T")[1].slice(0, 5),
        temp: Math.round(data.hourly.temperature_2m[index]).toString(),
      })),
    };
  } catch (error) {
    const networkCodes = new Set([
      "ECONNREFUSED",
      "ENOTFOUND",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ECONNRESET",
      "EAI_AGAIN",
    ]);

    if (networkCodes.has(error.code) || error.message?.includes("Network")) {
      const cityDisplay =
        city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      return {
        source: "mock (network blocked)",
        current: {
          temperature: "28",
          location: cityDisplay,
          humidity: "75%",
          wind: "12 km/h",
          unit: "Celsius",
        },
        forecast: buildMockForecast(),
        hourly: buildMockHourly(),
      };
    }

    throw error;
  }
}

module.exports = {
  getWeatherPayload,
};
