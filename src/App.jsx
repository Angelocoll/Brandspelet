import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";

const isAuthenticated = () => {
  return localStorage.getItem('auth') === 'true';
};


const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/" replace /> 
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Admin" element={<PrivateRoute element={<AdminPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
