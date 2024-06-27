// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import { GreetPage } from './pages/GreetPage';
import LoginPage from './pages/LoginPage';
import Playlist from './pages/Playlist';
import PlaylistInfoPage from './pages/PlaylistInfoPage';
import { AboutPage } from './pages/AboutPage'; 
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <div className="App">
      
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/playlists" element={<Playlist />} />
          <Route path="/playlists/:playlistId" element={<PlaylistInfoPage />} />
          <Route path="/" element={<GreetPage/>} />
          <Route path="/about" element={<AboutPage/>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}


export default App;

