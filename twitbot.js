var config = {
  consumer_key:         'XXXXX',
  consumer_secret:      'XXXXX',
  access_token:         'XXXXX',
  access_token_secret:  'XXXXX'
}

module.exports = config;

var T = new Twit(config);

T.post('statuses/update', { status: 'Look, I am tweeting!' }, function(err, data, response) {
  console.log(data)
});

var Twit = require('twit')

var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

T.post('statuses/update', { status: 'Look, I am tweeting!' }, function(err, data, response) {
  console.log(data)
});
