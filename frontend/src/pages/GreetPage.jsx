import React from 'react';
import './greetStyle.css';
import musicPic from '../assets/musicPic.png';
import { useNavigate } from 'react-router-dom';

export const GreetPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className='greeting-page'>
      <div className='content'>
        <div className='image-part'>
          <img src={musicPic} alt="Music" />
        </div>
        <div className='right-part'>
          <p>Don't let your vibe be ruined by nonsense ads</p>
          <button className='login-button' onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
  );
};
