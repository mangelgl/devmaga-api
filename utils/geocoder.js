const nodeGeocoder = require('node-geocoder');
const config = require('../config/index');

const options = {
	provider: config.GEOCODER.GEOCODER_PROVIDER,
	httpAdapter: 'https',
	apiKey: config.GEOCODER.GEOCODER_API_KEY, // for Mapquest, OpenCage, APlace, Google Premier
	formatter: null, // 'gpx', 'string', ...
};

const geocoder = nodeGeocoder(options);

module.exports = geocoder;
