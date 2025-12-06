const axios = require("axios");

const DEFAULT_CITY = "Maubin";
const FORECAST_DAYS = 7;
const WEATHER_STATUS_MAP = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

function getWeatherStatus(code) {
  return WEATHER_STATUS_MAP[Number(code)] || "Unknown";
}

function getWindDirection(degrees) {
  const value = Number(degrees);
  if (Number.isNaN(value)) {
    return "";
  }
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(((value % 360) / 22.5 + 16) % 16);
  return directions[index];
}

function deriveDailyWindDirection(hourlyTimes, hourlyDirections, dayTime) {
  if (
    !Array.isArray(hourlyTimes) ||
    !Array.isArray(hourlyDirections) ||
    !dayTime
  ) {
    return undefined;
  }
  const dayPrefix = dayTime.split("T")[0];
  const matchIndex = hourlyTimes.findIndex((time) =>
    time?.startsWith(dayPrefix)
  );
  if (matchIndex === -1 || hourlyDirections[matchIndex] == null) {
    return undefined;
  }
  return hourlyDirections[matchIndex];
}

function buildMockForecast(now = new Date()) {
  const mockCodes = [1, 2, 3, 80, 61, 45, 2];
  const mockWindSpeeds = [18, 16, 14, 20, 22, 15, 17];
  const mockWindDirections = [90, 120, 150, 180, 210, 240, 270];
  return Array.from({ length: FORECAST_DAYS }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + index);
    const code = mockCodes[index % mockCodes.length];
    return {
      day: date.toLocaleDateString("en", { weekday: "short" }),
      high: (32 - index).toString(),
      low: (24 - (index % 3)).toString(),
      status: getWeatherStatus(code),
      windSpeed: mockWindSpeeds[index % mockWindSpeeds.length].toString(),
      windDirection:
        getWindDirection(
          mockWindDirections[index % mockWindDirections.length]
        ) || "",
    };
  });
}

function buildMockHourly() {
  const mockCodes = [0, 1, 2, 3, 61, 63, 80, 95];
  const mockWindSpeeds = [8, 10, 12, 9, 14, 11, 13, 10];
  const mockDirections = [0, 45, 90, 135, 180, 225, 270, 315];
  return Array.from({ length: 24 }, (_, hour) => {
    const code = mockCodes[hour % mockCodes.length];
    const speed = mockWindSpeeds[hour % mockWindSpeeds.length];
    const direction = mockDirections[hour % mockDirections.length];
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      temp: (26 + (hour % 8)).toString(),
      status: getWeatherStatus(code),
      windSpeed: speed.toString(),
      windDirection: getWindDirection(direction) || "",
    };
  });
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
          hourly:
            "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
          daily:
            "temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,wind_direction_10m_dominant",
          timezone: "auto",
          forecast_days: FORECAST_DAYS,
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
        code: current.weather_code,
        status: getWeatherStatus(current.weather_code),
        unit: "Celsius",
      },
      forecast: data.daily.time.slice(0, FORECAST_DAYS).map((time, index) => {
        const rawDirection =
          data.daily.wind_direction_10m_dominant?.[index] ??
          deriveDailyWindDirection(
            data.hourly.time,
            data.hourly.wind_direction_10m,
            time
          );
        return {
          day: new Date(time).toLocaleDateString("en", { weekday: "short" }),
          high: Math.round(data.daily.temperature_2m_max[index]).toString(),
          low: Math.round(data.daily.temperature_2m_min[index]).toString(),
          status: getWeatherStatus(data.daily.weather_code?.[index]),
          windSpeed: Math.round(
            data.daily.wind_speed_10m_max?.[index] ?? 0
          ).toString(),
          windDirection: getWindDirection(rawDirection) || "",
        };
      }),
      hourly: data.hourly.time.slice(0, 24).map((time, index) => ({
        hour: time.split("T")[1].slice(0, 5),
        temp: Math.round(data.hourly.temperature_2m[index]).toString(),
        status: getWeatherStatus(data.hourly.weather_code?.[index]),
        windSpeed: Math.round(
          data.hourly.wind_speed_10m?.[index] ?? 0
        ).toString(),
        windDirection:
          getWindDirection(data.hourly.wind_direction_10m?.[index]) || "",
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
          code: 45,
          status: getWeatherStatus(45),
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
