const dotenv = require('dotenv');

const smtpConfig = {
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_EMAIL: process.env.SMTP_EMAIL,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
	FROM_EMAIL: process.env.FROM_EMAIL,
	FROM_NAME: process.env.FROM_NAME,
};

module.exports = smtpConfig;
