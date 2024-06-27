import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrackCard } from '../components/TrackCard';
import { useParams } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

const PlaylistInfoPage = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const { playlistId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthenticated(true);
    const fetchPlaylistDetails = async () => {
      try {
        const config = {
          withCredentials : true
        }
        const response = await axios.get(`http://localhost:5000/api/playlists/${playlistId}`, config);
        setTracks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch playlist details');
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h3>Error in loading your playlist tracks</h3>;

  return (
    <div>
      <h2>Playlist Details</h2>
      <ul>
        {tracks.map((track, index) => (
          <li key={index}>
            <div>
              <TrackCard image={track.imageUrl} trackName={track.track} trackArtist={track.artist} trackGenre={track.genre} trackLink={track.downloadUrl} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistInfoPage;
