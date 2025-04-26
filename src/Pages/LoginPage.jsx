import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginStyle.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const UserName = import.meta.env.VITE_ADMIN_USERNAME;;
  const Password = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === UserName && password === Password) {
      localStorage.setItem('auth', 'true'); 
      navigate("/Admin");
    } else {
      alert("Fel användarnamn eller lösenord");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Logga in</h2>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Logga in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;