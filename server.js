const dotenv = require('dotenv');
// * Load environment variables
// Must be called before any routing load for process.env.XX to work
dotenv.config({ path: './.env' });

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

const errorHandler = require('./middleware/errorHandler');
const config = require('./config/index');
const connectDatabase = require('./config/db');

// * Connect to database
connectDatabase();

// * Load route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// * Middlewares
if (config.NODE_ENV === 'development') {
	app.use(morgan('dev')); // Log access requests to the API
}

app.use(express.json()); // to parse the request body to JSON type
app.use(fileupload()); // to upload files
app.use(express.static(path.join(__dirname, 'public'))); // to set public folder
app.use(cookieParser()); // to parse cookies
app.use(mongoSanitize()); // To sanitize data and prevent nosql injections
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent xss attacks (cross-side scripting)

// * Mount routes
app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler); // to handle errors and error messages

// *** Start the server
const server = app.listen(
	config.PORT,
	console.log(
		`Server running on ${config.NODE_ENV} mode on port ${config.PORT}`.yellow
			.bold
	)
);

// Handle unhandle promise rejections
process.on('unHandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.bold);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});
