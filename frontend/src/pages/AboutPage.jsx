// src/pages/AboutPage.js
import React from 'react';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';
import './aboutStyle.css';
export const AboutPage = () => {
  const {setAuthenticated} = useContext(AuthContext)
  return (
    <div className="about-container">
      <h1>About BeatLoop</h1>
      <p>
        Welcome to BeatLoop, your ultimate Spotify playlist streamer and downloader! Developed by Vedant Kokane, a final year student at Pune Institute of Computer Technology (PICT), Pune.
      </p>
      <p>
        BeatLoop allows you to seamlessly stream or download your favorite Spotify playlists. To get started, simply sign up through your Spotify account and select the playlists you want to enjoy.
      </p>
      <p>
        Throughout my four-year journey in engineering, I have explored diverse domains in technology. I have applied my knowledge in iOS app development, navigated complex machine learning challenges, and dived into web development.
      </p>
      <p>
        I have applied these skills to develop practical projects including BeatLoop, which integrates cutting-edge technologies to enhance your music streaming experience.
      </p>
      <p>
        BeatLoop is developed with the highest standards of legality and ethical considerations. All functionalities and features are compliant with relevant regulations and guidelines.
      </p>
      <p>
        Thank you for choosing BeatLoop. We strive to provide you with a seamless and enjoyable music streaming experience.
      </p>
    </div>
  );
};
