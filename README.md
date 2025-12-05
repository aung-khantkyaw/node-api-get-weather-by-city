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
- `GET /weather/{city}` - Get weather for city

### Example Response
```json
{
  "source": "mock (network blocked)",
  "current": {
    "temperature": "28",
    "city": "Maubin",
    "humidity": "75%",
    "wind": "12 km/h",
    "unit": "Celsius"
  },
  "forecast": [
    { "day": "Fri", "high": "32", "low": "24" },
    { "day": "Sat", "high": "31", "low": "23" },
    { "day": "Sun", "high": "30", "low": "22" },
    { "day": "Mon", "high": "29", "low": "24" },
    { "day": "Tue", "high": "28", "low": "23" },
    { "day": "Wed", "high": "27", "low": "22" },
    { "day": "Thu", "high": "26", "low": "24" },
    { "day": "Fri", "high": "25", "low": "23" }
  ],
  "hourly": [
    { "hour": "00:00", "temp": "26" },
    { "hour": "01:00", "temp": "27" },
    { "hour": "02:00", "temp": "28" },
    { "hour": "03:00", "temp": "29" },
    { "hour": "04:00", "temp": "30" },
    { "hour": "05:00", "temp": "31" },
    { "hour": "06:00", "temp": "32" },
    { "hour": "07:00", "temp": "33" },
    { "hour": "08:00", "temp": "26" },
    { "hour": "09:00", "temp": "27" },
    { "hour": "10:00", "temp": "28" },
    { "hour": "11:00", "temp": "29" },
    { "hour": "12:00", "temp": "30" },
    { "hour": "13:00", "temp": "31" },
    { "hour": "14:00", "temp": "32" },
    { "hour": "15:00", "temp": "33" },
    { "hour": "16:00", "temp": "26" },
    { "hour": "17:00", "temp": "27" },
    { "hour": "18:00", "temp": "28" },
    { "hour": "19:00", "temp": "29" },
    { "hour": "20:00", "temp": "30" },
    { "hour": "21:00", "temp": "31" },
    { "hour": "22:00", "temp": "32" },
    { "hour": "23:00", "temp": "33" }
  ]
}
```