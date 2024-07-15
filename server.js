const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDatabase = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// Connect to database
connectDatabase();

// Load routes
const bootcamps = require('./routes/bootcamps');

const app = express();

if (NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file

const server = app.listen(
	PORT,
	console.log(`Server running on ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandle promise rejections
process.on('unHandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.bold);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});
