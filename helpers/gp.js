const config = require('../config.js');
const request = require('request');

const key = config.GP_KEY;

module.exports = {
  getPOI: (lat, lng, callback) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1600&key=${key}`;
    request.get(url, (err, res, body) => {
      err ? console.log(err) : callback(body);
    })
  }
}

//-33.8670522,151.1957362