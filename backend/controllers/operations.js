import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import cors from 'cors';
import session from 'express-session';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';
import cookieParser from 'cookie-parser';
import Activity from '../models/UserActivityModel.js';
import { connectDB } from "../config/dbConnection.js";

const SPOTIFY_CLIENT_ID = '42227dfaa2ae4abd836d04442c718c9d';
const SPOTIFY_CLIENT_SECRET = '767f523ab80f4b1788c56c9b0226cc06';
const SPOTIFY_REDIRECT_URI = 'http://localhost:5000/api/callback';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1/';



// Redirect to Spotify login
const loginToSpotifyAccount = async (req, res) => {
    // user-read-private user-read-email playlist-read-private
    const scope = 'playlist-read-private';
    const params = {
        client_id : SPOTIFY_CLIENT_ID,
        response_type: 'code',
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        show_dialog: true
    };
    const authURL = `${AUTH_URL}?${querystring.stringify(params)}`;
    res.redirect(authURL);
};

// Callback after Spotify login
const callbackAfterLogin = async (req, res) => {
    if (req.query.error) {
        return res.json({ message: req.query.error });
    }

    if (req.query.code) {
        try {
            const response = await axios.post(TOKEN_URL, querystring.stringify({
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: SPOTIFY_REDIRECT_URI,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const { access_token, refresh_token, expires_in } = response.data;
            res.cookie('access_token', access_token, {
                maxAge: expires_in * 1000,
                httpOnly: true,
                secure: false
            });
            res.redirect('http://localhost:3000/playlists');
        } 
        catch (error) {
            console.error('Error fetching token:', error.message);
            res.status(500).json({
                error: 'Failed to get token',
                details: error.response ? error.response.data : error.message
            });
        }
    }
};

// Fetch user's playlists
const fetchPlaylist = async (req, res) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}me/playlists`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const playlistsInfo = response.data.items;
        const playlistsId = {};
        playlistsInfo.forEach(playlist => {
            playlistsId[playlist.name] = playlist.id;
        });
        console.log(playlistsId)
        res.json(playlistsId);
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
        res.status(500).json({ error: 'Failed to fetch playlists', details: error.response ? error.response.data : error.message });
    }
};

// Fetch tracks from a playlist
const playlistService = async (req, res) => {
  const access_token = req.cookies.access_token;
  const playlistId = req.params.playlistId;
  console.log(access_token, playlistId);
  try {
    const response = await axios.get(`${API_BASE_URL}playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const trackInfo = response.data.items;
    const downloadLinks = [];
    for (const item of trackInfo) {
      const track = item.track || {};
      const trackName = track.name || 'Unknown track';
      let artistName = '';
      let artistId = '';

      if (track.artists && track.artists[0]) {
        artistName = track.artists[0].name;
        artistId = track.artists[0].id;
      } else {
        artistName = 'Unknown artist';
      }

      let trackGenre = 'Unknown';
      try {
        const artistResponse = await axios.get(`${API_BASE_URL}artists/${artistId}`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });

        const artistInfo = artistResponse.data;
        trackGenre = artistInfo.genres.length > 0 ? artistInfo.genres.join(', ') : 'Unknown';
      } catch (error) {
        console.error(`Error fetching genre for artist ${artistName}:`, error.message);
      }

      let imageUrl = ''; // Placeholder for track image URL
      try {
        const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });

        if (trackResponse.data && trackResponse.data.album && trackResponse.data.album.images && trackResponse.data.album.images.length > 0) {
          imageUrl = trackResponse.data.album.images[0].url; // Assuming first image as thumbnail
        }
      } catch (error) {
        console.error(`Error fetching track image for ${trackName}:`, error.message);
      }

      const downloadResult = await getVideoUrl(trackName, artistName);
      if (downloadResult.status === 'success') {
        const fileUrl = `${req.protocol}://${req.get('host')}/api/stream_audio/${downloadResult.video_id}/${encodeURIComponent(trackName)}/${encodeURIComponent(artistName)}/${encodeURIComponent(trackGenre)}`;
        downloadLinks.push({
          track: trackName,
          artist: artistName,
          genre: trackGenre,
          downloadUrl: fileUrl,
          imageUrl: imageUrl
        });
      } else {
        downloadLinks.push({
          track: trackName,
          artist: artistName,
          genre: trackGenre,
          error: downloadResult.error,
          imageUrl
        });
      }
    }

    res.json(downloadLinks);
  } catch (error) {
    console.error('Error fetching tracks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tracks', details: error.response ? error.response.data : error.message });
  }
};

// Stream audio function
const streamAudioFunction = async (req, res) => {
  const videoId = req.params.video_id;
  const trackName = decodeURIComponent(req.params.trackName);
  const artistName = decodeURIComponent(req.params.artistName);
  const trackGenre = decodeURIComponent(req.params.trackGenre);

  console.log({ videoId, trackName, artistName, trackGenre });
  const url = `http://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    console.log(format.url);

    // Assuming the activity record is created here
    const activityRecord = await Activity.create({ songName: trackName, artistName: artistName, songGenre: trackGenre });

    res.redirect(format.url);
  } catch (error) {
    console.error('Error streaming audio:', error.message);
    res.json({ error: error.message });
  }
};

const sanitizeFilename = (name) => {
  return name.replace(/[\\/*?:"<>|]/g, "");
};

const getVideoUrl = async (songName, artistName) => {
  songName = sanitizeFilename(songName);
  artistName = sanitizeFilename(artistName);

  const query = `${songName} ${artistName} audio`;

  try {
    const searchResults = await ytsr(query, { limit: 1 });
    if (searchResults.items.length === 0) {
      return { error: 'No results found' };
    }
    const videoId = searchResults.items[0].id;
    return { status: 'success', video_id: videoId };
  } catch (error) {
    return { error: error.message };
  }
};

export {loginToSpotifyAccount, callbackAfterLogin, fetchPlaylist, playlistService, streamAudioFunction};


