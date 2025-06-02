import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Paises } from "./Countries";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [nacionalidad, setNac] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            dni: dni,
            nacionalidad: nacionalidad,
            nombre: name,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Error de registro");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="img">
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <p className="form-login">Register</p>
          <div className="input-box">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
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
          <div className="input-box">
            <input
              type="number"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="DNI"
              required
            />
          </div>
          <div className="input-box">
            <Paises
              name="country"
              value={nacionalidad}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNac(e.target.value)
              }
              
              required
            />
          </div>
          <button className="btn" type="submit">
            Register
          </button>
          {error && <p className="error-message">{error}</p>}
          <div className="register-link">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
