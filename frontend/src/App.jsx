import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Request from './components/Request';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="settings" element={<h1>Settings</h1>} />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Route path="request/:id" element={<Request />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
