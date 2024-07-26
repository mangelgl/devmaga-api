const nodemailer = require('nodemailer');
const config = require('../config/index');

const sendMail = async (options) => {
	// Create transport
	const transporter = nodemailer.createTransport({
		host: config.SMTP.SMTP_HOST,
		port: config.SMTP.SMTP_PORT,
		secure: false, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: config.SMTP.SMTP_EMAIL,
			pass: config.SMTP.SMTP_PASSWORD,
		},
	});

	// send mail with defined transport object
	const mailBodyOptions = {
		from: `"${config.SMTP.FROM_NAME}" <${config.SMTP.FROM_EMAIL}>`, // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
	};

	const info = await transporter.sendMail(mailBodyOptions);

	console.log('Message sent: %s', info.messageId);
	// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

module.exports = sendMail;
