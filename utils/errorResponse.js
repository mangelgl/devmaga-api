class ErrorResponse extends Error {
	constructor(statusCode, message) {
		super(message); // Create an instance of Error class with the message of actual class.
		this.statusCode = statusCode;
	}
}

module.exports = ErrorResponse;
