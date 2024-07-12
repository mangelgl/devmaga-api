const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// Load routes
const bootcamps = require('./routes/bootcamps');

const app = express();

app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file

app.listen(PORT, console.log(`Server running on ${NODE_ENV} mode on port ${PORT}`));