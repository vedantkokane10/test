// src/components/LoginPage.js
import React from 'react';
import axios from 'axios';
import './greetStyle.css';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

const LoginPage = () => {
  const {setAuthenticated} = useContext(AuthContext)
  
  const handleLogin = async () => {
    setAuthenticated(true);
    const spotifyLoginEndpoint = 'http://localhost:5000/api/login';
    window.location.href = spotifyLoginEndpoint;
  };
  

  return (
    <div>
      <h1>Login with Spotify</h1>
      <div className='privacy-part'>
        <p>We value your privacy. When you log in with Spotify, we only request the following permissions:</p>
        <ul>
          <li> <strong>Your profile information.</strong></li>
          <li> <strong>Your public and private playlists.</strong></li>
        </ul>
        <p>We assure you that apart from accessing your playlists, we do not use any of your personal information for any other purpose.</p>
      </div>
      <button className='login-button2' onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default LoginPage;
