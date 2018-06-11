const config = require('../config.js');
const request = require('request');

const key = config.GP_KEY;

module.exports = {
  getPOI: (location, callback) => {
    const encodedURI = encodeURI(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&key=${key}`)
    request.get({
      method: 'GET',
      uri: encodedURI,
      json: true
    })
    .then((data) => callback(data))
  }
}