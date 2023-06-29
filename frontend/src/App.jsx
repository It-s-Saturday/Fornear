import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';

import Home from './components/Home';
import Request from './components/Request';

import Staff from './components/staff/Staff';
import RequestList from './components/staff/RequestList';
import Inventory from './components/staff/Inventory';
import CreatePackage from './components/staff/CreatePackage';
import Insert from './components/staff/Insert';
import Update from './components/staff/Update';

import Admin from './components/admin/Admin';

import Background from './components/Background';

/**
 * Holds the navbar, routes, and background of the app
 * @returns {JSX.Element} App
 */
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="request/:_id" element={<Request />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/requests" element={<RequestList />} />
          <Route path="staff/inventory" element={<Inventory />} />
          <Route path="staff/create-package" element={<CreatePackage />} />
          <Route path="staff/insert" element={<Insert />} />
          <Route path="staff/update" element={<Update />} />

          <Route path="admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Background />
    </>
  );
}

export default App;
