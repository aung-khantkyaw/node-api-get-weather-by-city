# Weather by City API (Node.js)

A Node.js API that provides weather information using the Open-Meteo API.

## Installation

```bash
npm install
```

## Usage

### Start the server
```bash
npm start
# or for development
npm run dev
```

### CLI usage
```bash
node src/index.js London
node src/index.js "New York"
```

### Project Structure

```
.
├── public/              # Static landing page + assets
├── src/
│   ├── app.js           # Express app wiring
│   ├── index.js         # Entry point (CLI + server)
│   ├── routes/          # Route definitions
│   └── services/        # Weather fetching logic
└── README.md
```

### API Endpoints

- `GET /health` - Health check
- `GET /v1/weather/{city}` - Get weather for city

### Example Response
```json
{
  "source": "open-meteo",
  "current": {
    "temperature": "28",
    "location": "Maubin",
    "humidity": "72%",
    "wind": "9.6 km/h",
    "code": 2,
    "status": "Partly cloudy",
    "unit": "Celsius"
  },
  "forecast": [
    {
      "day": "Sat",
      "high": "31",
      "low": "23",
      "status": "Overcast",
      "windSpeed": "10",
      "windDirection": "NNE"
    },
    {
      "day": "Sun",
      "high": "31",
      "low": "23",
      "status": "Mainly clear",
      "windSpeed": "12",
      "windDirection": ""
    },
    {
      "day": "Mon",
      "high": "31",
      "low": "22",
      "status": "Overcast",
      "windSpeed": "12",
      "windDirection": "NNE"
    },
    {
      "day": "Tue",
      "high": "30",
      "low": "22",
      "status": "Partly cloudy",
      "windSpeed": "9",
      "windDirection": "ENE"
    },
    {
      "day": "Wed",
      "high": "29",
      "low": "22",
      "status": "Light rain showers",
      "windSpeed": "8",
      "windDirection": "NNE"
    },
    {
      "day": "Thu",
      "high": "30",
      "low": "22",
      "status": "Partly cloudy",
      "windSpeed": "10",
      "windDirection": "NNE"
    },
    {
      "day": "Fri",
      "high": "30",
      "low": "21",
      "status": "Partly cloudy",
      "windSpeed": "11",
      "windDirection": "N"
    }
  ],
  "hourly": [
    {
      "hour": "00:00",
      "temp": "24",
      "status": "Partly cloudy",
      "windSpeed": "5",
      "windDirection": "N"
    },
    {
      "hour": "01:00",
      "temp": "24",
      "status": "Partly cloudy",
      "windSpeed": "5",
      "windDirection": "N"
    },
    {
      "hour": "02:00",
      "temp": "24",
      "status": "Partly cloudy",
      "windSpeed": "6",
      "windDirection": "N"
    },
    {
      "hour": "03:00",
      "temp": "24",
      "status": "Overcast",
      "windSpeed": "7",
      "windDirection": "N"
    },
    {
      "hour": "04:00",
      "temp": "24",
      "status": "Overcast",
      "windSpeed": "7",
      "windDirection": "N"
    },
    {
      "hour": "05:00",
      "temp": "23",
      "status": "Overcast",
      "windSpeed": "7",
      "windDirection": "N"
    },
    {
      "hour": "06:00",
      "temp": "23",
      "status": "Overcast",
      "windSpeed": "6",
      "windDirection": "NNE"
    },
    {
      "hour": "07:00",
      "temp": "24",
      "status": "Overcast",
      "windSpeed": "6",
      "windDirection": "NNE"
    },
    {
      "hour": "08:00",
      "temp": "25",
      "status": "Partly cloudy",
      "windSpeed": "8",
      "windDirection": "NNE"
    },
    {
      "hour": "09:00",
      "temp": "27",
      "status": "Partly cloudy",
      "windSpeed": "9",
      "windDirection": "NNE"
    },
    {
      "hour": "10:00",
      "temp": "28",
      "status": "Partly cloudy",
      "windSpeed": "10",
      "windDirection": "NNE"
    },
    {
      "hour": "11:00",
      "temp": "30",
      "status": "Partly cloudy",
      "windSpeed": "9",
      "windDirection": "NNE"
    },
    {
      "hour": "12:00",
      "temp": "31",
      "status": "Overcast",
      "windSpeed": "9",
      "windDirection": "NNE"
    },
    {
      "hour": "13:00",
      "temp": "31",
      "status": "Overcast",
      "windSpeed": "8",
      "windDirection": "ENE"
    },
    {
      "hour": "14:00",
      "temp": "30",
      "status": "Overcast",
      "windSpeed": "8",
      "windDirection": "ENE"
    },
    {
      "hour": "15:00",
      "temp": "30",
      "status": "Partly cloudy",
      "windSpeed": "6",
      "windDirection": "ENE"
    },
    {
      "hour": "16:00",
      "temp": "30",
      "status": "Partly cloudy",
      "windSpeed": "5",
      "windDirection": "ENE"
    },
    {
      "hour": "17:00",
      "temp": "28",
      "status": "Partly cloudy",
      "windSpeed": "3",
      "windDirection": "ENE"
    },
    {
      "hour": "18:00",
      "temp": "28",
      "status": "Partly cloudy",
      "windSpeed": "2",
      "windDirection": "E"
    },
    {
      "hour": "19:00",
      "temp": "27",
      "status": "Partly cloudy",
      "windSpeed": "1",
      "windDirection": "NE"
    },
    {
      "hour": "20:00",
      "temp": "27",
      "status": "Mainly clear",
      "windSpeed": "2",
      "windDirection": "NW"
    },
    {
      "hour": "21:00",
      "temp": "26",
      "status": "Mainly clear",
      "windSpeed": "3",
      "windDirection": "WNW"
    },
    {
      "hour": "22:00",
      "temp": "26",
      "status": "Mainly clear",
      "windSpeed": "3",
      "windDirection": "NW"
    },
    {
      "hour": "23:00",
      "temp": "25",
      "status": "Clear sky",
      "windSpeed": "4",
      "windDirection": "NW"
    }
  ]
}
```