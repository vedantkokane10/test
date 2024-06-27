import React from 'react';
import { Link } from 'react-router-dom';
import './navbarStyle.css';
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

export const Navbar = () => {
  const {isAuthenticated} = useContext(AuthContext)
  return (
    <div className='Navbar'>
      <div className='Navbar-container'>
        <div className='logo'>
          BeatLoop
        </div>
        <div className='links'>
          <Link to='/about'>About</Link>
            {isAuthenticated ? (
              <span><i className="fa fa-spotify" style={{ fontSize: '24px' }}></i></span>
            ) : 

              (
                <Link to='/login'>
                <i className="fa fa-spotify" style={{ fontSize: '24px' }}></i>
                &nbsp;Login
                </Link>
              )
            }
        </div>
      </div>
    </div>
  );
}
