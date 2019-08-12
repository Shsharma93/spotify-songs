const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
app.use(cors());

const clientId = '2538e589ea5b4d848a215b7c3f6d75fd',
  clientSecret = 'ac496f0f67554723babcee838ac7f622';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  accessToken: ''
});

app.get('/', function(req, res) {
  console.log(req.query.q);
  if (!req || !req.query) return res.status(500);
  const q = req.query.q;
  if (q.trim().length === 0) return res.json([]);

  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);

      spotifyApi
        .searchTracks(`track:${encodeURIComponent(q)}`, {
          limit: 5,
          fields: 'items'
        })
        .then(
          function(data) {
            // res.send(data.body.tracks.items[0].name);
            res.send(data.body);
          },
          function(err) {
            console.log('Something went wrong!', err);
          }
        );
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
});

const port = process.env.PORT || 5000;
app.listen(port);
