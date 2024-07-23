const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/errorHandler');
const connectDatabase = require('./config/db');

// Load env vars
// Must be called before any routing load for Mapquest package to work
dotenv.config({ path: './.env' });

// Connect to database
connectDatabase();

// Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

// * Middlewares
// Log access request to the API
if (NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Parse the body
app.use(express.json());
// File upload
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// * End Middlewares

// Load routes
app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
