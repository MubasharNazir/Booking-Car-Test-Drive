import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarSearch from './pages/CarSearch';
import Dashboard from './pages/Dashboard';
import BookRide from './pages/BookRide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarSearch />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-ride" element={<Dashboard><BookRide /></Dashboard>} />
        <Route path="/my-bookings" element={<Dashboard><div>My Bookings Page</div></Dashboard>} />
        <Route path="/profile" element={<Dashboard><div>Profile Page</div></Dashboard>} />
        <Route path="/settings" element={<Dashboard><div>Settings Page</div></Dashboard>} />
      </Routes>
    </Router>
  );
}

export default App;
