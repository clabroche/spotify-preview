var express = require('express');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());

var stateKey = 'spotify_auth_state';

let client_id
let client_secret
var redirect_uri = 'http://localhost:5000/callback';
let token = null

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  next();
});

app.get('/poll-token', (req, res) => {
  console.log(token)
  res.json(token)
  token = null
})
app.get('/login', function (req, res) {
  console.log('login')
  client_id = req.query.client_id
  client_secret = req.query.client_secret
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
  console.log('redirect')
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  console.log('callback')
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.log('state mismatch', 'state: ' + state, 'storedState ' + storedState, 'cookies ', req.cookies);
    res.json({
      access_token: null,
      expires_in: null
    });
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token,
          expires_in = body.expires_in;

        console.log('everything is fine');
        token = access_token
      } else {
        console.log(error, response);

        res.json({
          access_token: null,
          expires_in: null
        });
      }
    });
  }
});

app.post('/token', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var refreshToken = req.body ? req.body.refresh_token : null;
  if (refreshToken) {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          expires_in = body.expires_in;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ access_token: access_token, expires_in: expires_in }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ access_token: '', expires_in: '' }));
      }
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ access_token: '', expires_in: '' }));
  }
});

app.listen(app.get('port'), function () {
  console.log('Oauth server run on port', app.get('port'));
});