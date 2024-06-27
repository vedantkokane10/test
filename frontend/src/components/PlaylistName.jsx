import React from 'react';
import './playlistName.css';

export const PlaylistName = (props) => {
  const { playlistName, playlistId } = props;
  const link = `/playlists/${playlistId}`;
  return (
    <div className='card'>
      <div className='card-content'>
        <a href={link}>{playlistName}</a>
      </div>
    </div>
  );
}
