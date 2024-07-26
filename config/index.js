const dotenv = require('dotenv');

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	DB: {
		MONGO_URI: process.env.MONGO_URI,
	},
	JWT: {
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_EXPIRES: process.env.JWT_EXPIRES,
		JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
	},
	SMTP: {
		SMTP_HOST: process.env.SMTP_HOST,
		SMTP_PORT: process.env.SMTP_PORT,
		SMTP_EMAIL: process.env.SMTP_EMAIL,
		SMTP_PASSWORD: process.env.SMTP_PASSWORD,
		FROM_EMAIL: process.env.FROM_EMAIL,
		FROM_NAME: process.env.FROM_NAME,
	},
	GEOCODER: {
		GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
		GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
	},
	FILE_UPLOADS: {
		MAX_FILESIZE_UPLOAD: process.env.MAX_FILESIZE_UPLOAD,
		FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
	},
};

module.exports = config;
