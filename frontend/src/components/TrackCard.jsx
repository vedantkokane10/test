import React from 'react';
import './cardStyle.css';

export const TrackCard = (props) => {
  const { image, trackName, trackArtist, trackGenre, trackLink } = props;
  return (
    <div className='card'>
      <div className='card-content'>
        <div className='left-part'>
          <img src={image} alt={`${trackName} cover`} />
        </div>
        <div className='right-part'>
          <p>Track - {trackName}</p>
          <p>Artist - {trackArtist}</p>
          <p>Genre - {trackGenre}</p>
          <button><a href={trackLink} target='_blank' rel='noopener noreferrer'>Stream / Download</a></button>
        </div>
      </div>
    </div>
  );
}
