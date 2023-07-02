import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Admin from './components/admin/Admin';
import Background from './components/Background';
import Home from './components/Home';
import Navbar from './components/navbar/Navbar';
import Request from './components/Request';
import CreatePackage from './components/staff/CreatePackage';
import Insert from './components/staff/Insert';
import Inventory from './components/staff/Inventory';
import RequestList from './components/staff/RequestList';
import Staff from './components/staff/Staff';
import Update from './components/staff/Update';

/**
 * Holds the navbar, routes, and background of the app
 * @returns {JSX.Element} App
 */
function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
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
