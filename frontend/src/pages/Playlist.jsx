import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { PlaylistName } from '../components/PlaylistName';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

const Playlist = () => {
    const navigate = useNavigate();
    const {setAuthenticated} = useContext(AuthContext)
    const [playlistsDetails, setPlaylistsDetails] = useState([]);

    useEffect(() => {
        setAuthenticated(true);
        const fetchPlaylistsDetails = async () => {
            try{
                const config = {
                    headers: {'Content-Type' : 'application/json'},
                    withCredentials : true
                }
                const response = await axios.get('http://localhost:5000/api/playlists',config);
                setPlaylistsDetails(response.data);
                if(playlistsDetails.length === 0){
                    return (
                        <h3>No playlist found</h3>
                    )
                }
                console.log(response.data);
            }
            catch(error){
                console.error('Failed to fetch playlists:', error.message);
            }
        };
        fetchPlaylistsDetails();

    },[]);

    return (
        <div>
            <h1>Select the playlist you want to play </h1>
            <ul>
                {Object.keys(playlistsDetails).map((name,index) => (
                    <PlaylistName playlistName={name} playlistId={playlistsDetails[name]} />
                ))}
            </ul>
        </div>
    );
};

export default Playlist;
