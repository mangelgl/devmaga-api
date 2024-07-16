const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDatabase = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
// Must be called before any routing load for Mapquest package to work
dotenv.config({ path: './.env' });

// Routes
const bootcamps = require('./routes/bootcamps');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// Connect to database
connectDatabase();

const app = express();

// * Middlewares
// Log access request to the API
if (NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Parse the body
app.use(express.json());

// * End Middlewares

// Load routes
app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file
app.use(errorHandler);

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
