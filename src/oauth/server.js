const express = require('express');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const { default: Axios } = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let client_id
let client_secret
let token = null
const redirect_uri = 'http://localhost:5000/callback';
const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const stateKey = 'spotify_auth_state';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  next();
});

/** Used to get token in used */
app.get('/poll-token', (req, res) => {
  console.log('=> Poll')
  res.json(token)
})

/** log to spotify */
app.get('/login', function (req, res) {
  console.log('=> Login')
  client_id = req.query.client_id
  client_secret = req.query.client_secret
  const  state = generateRandomString(16);

  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', async function (req, res) {
  console.log('=> Callback')
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    console.log('State is different we cannot process oAuth for your security');
    res.json({
      expires_in: null,
      access_token: null,
    });
  } else {
    res.clearCookie(stateKey);
    const requestData = { // in axios requestData is the body request
      grant_type: 'authorization_code',
      code: code, // code I'm receiving from https://accounts.spotify.com/authorize
      redirect_uri
    }
    const url=  `https://accounts.spotify.com/api/token`
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64') // client id and secret from env
      }
    }
    const {data, status}= await Axios.post(url, querystring.stringify(requestData), config)

    if (status === 200) {
        var access_token = data.access_token,
          refresh_token = data.refresh_token,
          expires_in = data.expires_in;
        selfRefreshToken(refresh_token, expires_in, access_token)
        token = access_token
      res.json({
        access_token, expires_in, refresh_token
      })
        console.log('everything is fine');
    } else {
      res.json({
        access_token: null,
        expires_in: null
      });
    }
  }
});

app.post('/token', function (req, res) {
  console.log('=> Refresh Token')
  res.setHeader('Access-Control-Allow-Origin', '*');
  var refresh_token = req.body ? req.body.refresh_token : null;
  if (refresh_token) {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token,
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
        token = access_token
        selfRefreshToken(refresh_token, expires_in, access_token)
        res.send('ok');
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


function selfRefreshToken(refresh_token, expires_in, access_token) {
  setTimeout(() => {
    Axios.post('http://localhost:5000/token', {
      refresh_token, expires_in, access_token
    })
  }, (expires_in - 50) * 1000);
}


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