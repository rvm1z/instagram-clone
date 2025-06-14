import Navbar from './components/Navbar';
import CreatePost from './pages/CreatePost';
import PrivateRoute from './components/PrivateRoute';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

function App() {
  return (
   <Router>
  <Navbar />
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Feed />
        </PrivateRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/create-post"
      element={
        <PrivateRoute>
          <CreatePost />
        </PrivateRoute>
      }
    />
  </Routes>
</Router>
  );
}

export default App;
