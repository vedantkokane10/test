// src/components/TrackPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

const TrackPage = ({ playlistId }) => {
  const {setAuthenticated} = useContext(AuthContext)
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setAuthenticated(true);
    const fetchTracks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/playlist/${playlistId}/tracks`); // Replace with your backend URL
        setTracks(response.data);
      } catch (error) {
        console.error(`Error fetching tracks for playlist ${playlistId}:`, error);
      }
    };

    fetchTracks();
  }, [playlistId]);

  return (
    <div>
      <h1>Tracks</h1>
      {tracks.map((track) => (
        <div key={track.id}>
          <h3>{track.name}</h3>
          <p>{track.artists} - {track.album}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackPage;
