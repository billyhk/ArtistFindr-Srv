require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Return Access Token given a Refresh Token.
app.post('/refresh', (req, res) => {
	const redirectUri =
		req.body.windowLocationHostname === 'localhost'
			? 'http://localhost:3000/artists'
			: 'http://artist-findr.herokuapp.com/artists';

	const refreshToken = req.body.refreshToken;

	// Provide credentials.
	const spotifyApi = new SpotifyWebApi({
		redirectUri,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken,
	});

	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken: data.body.accessToken,
				expiresIn: data.body.expiresIn,
			});
		})
		.catch(() => res.sendStatus(400));
});

// Return Access Token given a Code. (The client received the code in exchange for Client ID and Client Secret.)
app.post('/login', (req, res) => {
	const code = req.body.code;
	const redirectUri =
		req.body.windowLocationHostname === 'localhost'
			? 'http://localhost:3000/artists'
			: 'http://artist-findr.herokuapp.com/artists';

	// Provide credentials.
	const spotifyApi = new SpotifyWebApi({
		redirectUri,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	});

	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expiresIn,
			});
		})
		.catch(() => res.sendStatus(400));
});

app.listen(process.env.PORT || 5000);
