import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/Navbar/Navbar";
import TransactionHistory from "../Components/Transaction/TransactionHistory";
import Loader from "../Components/Loader/loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faDownload, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useUser, Balance } from "../Components/Context/UserContext";

type Currency = keyof Balance;

const Home = () => {
  const { userInfo, balance, fetchUserData } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [navigate]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value as Currency);
  };

  const currencyOptions = Object.keys(balance) as Currency[];

  if (!userInfo) return <Loader />;

  const isDisabled = !userInfo.isconfirmed;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-6">Bienvenido, {userInfo.nombre}</h2>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col items-center mb-8">
          <h3 className="text-3xl font-semibold mb-4">Balance Actual</h3>
          <p className="text-lg mb-4">
            <span className="text-4xl font-extrabold text-green-600">
              $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
            </span>{" "}
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4 m-5"
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>

            <button
              disabled={isDisabled}
              onClick={() => navigate("/exchange")}
              className={`px-4 py-2 rounded-lg shadow transition ml-3 flex items-center ${
                isDisabled
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Convertir
            </button>
            {isDisabled && (
              <p className="text-yellow-400 text-sm mt-2">
                Verificá tu correo para activar esta función.
              </p>
            )}
          </p>

          <div className="flex justify-between items-center w-full mt-6 flex-col md:flex-row gap-4 md:gap-0">
            <div className="flex flex-col items-center w-full md:w-auto">
              <button
                disabled={isDisabled}
                onClick={() => navigate("/loadbalance")}
                className={`w-full px-6 py-3 rounded-lg shadow flex items-center justify-center ${
                  isDisabled
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Ingresar Dinero
              </button>
              {isDisabled && (
                <span className="text-yellow-400 text-sm mt-2 text-center">
                  Función bloqueada hasta confirmar tu email.
                </span>
              )}
            </div>

            <div className="flex flex-col items-center w-full md:w-auto">
              <button
                disabled={isDisabled}
                onClick={() => navigate("/transaction")}
                className={`w-full px-6 py-3 rounded-lg shadow flex items-center justify-center ${
                  isDisabled
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
              >
                <FontAwesomeIcon icon={faMoneyBillTransfer} className="mr-2" />
                Transferir Dinero
              </button>
              {isDisabled && (
                <span className="text-yellow-400 text-sm mt-2 text-center">
                  Necesitás verificar tu correo.
                </span>
              )}
            </div>
          </div>
        </div>

        <TransactionHistory />
      </main>
    </div>
  );
};

export default Home;
