import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Request from './components/Request';
import Staff from './components/staff/Staff';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="request/:_id" element={<Request />} />
        <Route path="staff" element={<Staff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
