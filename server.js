// Import required packages
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

// Log API key and environment variables for debugging
console.log("Loaded API Key:", process.env.OPENWEATHER_API_KEY);
console.log("Environment Loaded:", process.env);

// Initialize Express app
const app = express();
const PORT = 3000;

// Serve static files (e.g., index.html, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html from the public folder
});

// Set up a route for the weather API
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  
  if (!city) {
    return res.status(400).json({ error: 'Please provide a city name' });
  }

  try {
    // Make a request to the OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    // Extract the data to send back to the client
    const data = {
      location: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    };

    // Send the weather data as JSON response
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
