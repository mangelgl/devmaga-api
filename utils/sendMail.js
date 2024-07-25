const nodemailer = require('nodemailer');
const smtpConfig = require('../config/smtpConfig');

const sendMail = async (options) => {
	// Create transport
	const transporter = nodemailer.createTransport({
		host: smtpConfig.SMTP_HOST,
		port: smtpConfig.SMTP_PORT,
		secure: false, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: smtpConfig.SMTP_EMAIL,
			pass: smtpConfig.SMTP_PASSWORD,
		},
	});

	// send mail with defined transport object
	const mailBodyOptions = {
		from: `"${smtpConfig.FROM_NAME}" <${smtpConfig.FROM_EMAIL}>`, // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
	};

	const info = await transporter.sendMail(mailBodyOptions);

	console.log('Message sent: %s', info.messageId);
	// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

module.exports = sendMail;
