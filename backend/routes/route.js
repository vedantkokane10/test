import express from "express";
import {greeting} from '../controllers/greet.js'
import {loginToSpotifyAccount, callbackAfterLogin, fetchPlaylist, playlistService, streamAudioFunction} from '../controllers/operations.js'

const router = express.Router();


router.get('/',greeting);

// login
router.get('/api/login', loginToSpotifyAccount);

// callback
router.get('/api/callback', callbackAfterLogin);

// to get playlists (name and id)
router.get('/api/playlists', fetchPlaylist);

// to get tracks from a specific playlist (name, artist, genre, download link)
router.get('/api/playlists/:playlistId', playlistService);

// to stream audio from youtube
router.get('/api/stream_audio/:video_id/:trackName/:artistName/:trackGenre', streamAudioFunction);


export default router;