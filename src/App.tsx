import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Upload from './Pages/Upload';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
}

export default App;
