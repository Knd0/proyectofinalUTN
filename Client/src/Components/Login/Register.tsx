import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface Country {
  name: { official: string };
}

const Register = () => {
  const [countries, setCountries] = useState<Country[]>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [nacionalidad, setNac] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        // Si ya hay token, redirigir a /home
        navigate("/home");
      }
    }, [navigate]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.official.localeCompare(b.name.official)
        );
        setCountries(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

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
            <select
              value={nacionalidad}
              onChange={(e) => setNac(e.target.value)}
              required
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white max-h-48 overflow-y-auto text-gray-700"
            >
              <option value="" disabled hidden>
                Nacionalidad
              </option>
              {countries?.map((c, i) => (
                <option key={i} value={c.name.official} className="text-black">
                  {c.name.official}
                </option>
              ))}
            </select>
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
