import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/Navbar/Navbar";
import TransactionHistory from "../Components/Transaction/TransactionHistory";
import Loader from "../Components/Loader/loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faDownload, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [balance, setBalance] = useState<any>({
    ARS: 0,
    USD: 0,
    EUR: 0,
    BTC: 0,
    ETH: 0,
    USDT: 0,
  });
  
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      navigate("/login"); // Redirige al login si no hay token
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          navigate("/login"); // Redirige al login si no hay token
          return;
        }

        const response = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        console.log(data);
        setUserInfo(data.user);
        setBalance(data.user.balance);
        setLoading(false);
      } catch (err) {
        setError("No se pudo cargar la información del usuario");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  const currencyOptions = Object.keys(balance);

  if (!userInfo){
    return <Loader/>
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar/>

      <main
        className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold mb-6">
          Bienvenido, {userInfo.nombre}
        </h2>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col items-center mb-8">
          <h3 className="text-3xl font-semibold mb-4">Balance Actual</h3>
          <p className="text-lg mb-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-green-600">
              $ {balance[selectedCurrency]}
            </span>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </p>

          <div className="flex justify-between items-center w-full mt-4">
            <Link
              to="/loadbalance"
              className="bg-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
            >
              <FontAwesomeIcon icon={faDownload}  className="mr-2" />
              Ingresar Dinero
            </Link>
            <Link
              to="/transaction"
              className="bg-blue-500 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition text-white font-semibold ml-5 flex items-center"
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer}  className="mr-2" />
              Transferir Dinero
            </Link>
            <Link
              to="/exchange"
              className="bg-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
            >
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Convertir
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <TransactionHistory/>

        <section className="w-full max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10"></section>

      </main>
    </div>
  );
};

export default Home;
