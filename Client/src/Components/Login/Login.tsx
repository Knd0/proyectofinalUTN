import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://proyectofinalutn-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const secretKey = 'default_secret_key'; // Vite
        // const secretKey = process.env.REACT_APP_SECRET_KEY || 'default_secret_key'; // CRA (Create React App)
        const encryptedId = CryptoJS.AES.encrypt(String(data.user.id), secretKey).toString();

        localStorage.setItem('token', data.token);
        localStorage.setItem('encryptedId', encryptedId);

        navigate('/home');
      } else {
        setError(data.error || 'Error de login');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="img">
      <div className="wrapper">
          <form onSubmit={handleLogin}>
            <p className="form-login">Login</p>
            <div className="input-box">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#">Forgot Password</a>
            </div>
            <button className="btn" type="submit">Login</button>
            {error && <p className="error-message">{error}</p>}
            <div className="register-link">
              <p>Don't have an account?   <a href="/register">Register</a></p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;
