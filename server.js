const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, console.log(`Server running on ${NODE_ENV} mode on port ${PORT}`));