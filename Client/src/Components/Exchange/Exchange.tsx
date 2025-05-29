import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

interface Props {
  balances?: { [key: string]: number };
  onBalanceUpdate?: () => void;
}

const Exchange: React.FC<Props> = ({
  balances = {},
  onBalanceUpdate = () => {}
}) => {
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }

      try {
        const res = await axios.get(`https://api.currencyapi.com/v3/latest`, {
          params: {
            apikey: "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX",
            base_currency: fromCurrency,
            currencies: toCurrency,
          },
        });

        const rate = res.data?.data?.[toCurrency]?.value;
        setExchangeRate(rate);
      } catch (err) {
        console.error("Error al obtener tasa de cambio", err);
        setExchangeRate(null);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedValue(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleSwap = async () => {
    if (fromCurrency === toCurrency) return alert("Las monedas deben ser diferentes");
    if (amount <= 0) return alert("La cantidad debe ser mayor que cero");
    if ((balances[fromCurrency] ?? 0) < amount) return alert(`Saldo insuficiente en ${fromCurrency}`);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`https://proyectofinalutn-production.up.railway.app/convert`, {
        fromCurrency,
        toCurrency,
        amount,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Convertiste ${amount} ${fromCurrency} a ${res.data.converted.toFixed(2)} ${toCurrency}`);
      setAmount(0);
      setConvertedValue(null);
      onBalanceUpdate();

      setRedirecting(true);
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error al realizar la conversión");
    }
  };

  if (redirecting) {
    return (
      <div className="p-4 bg-white shadow rounded-xl w-full max-w-md mx-auto text-center text-lg font-semibold">
        Redirigiendo...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Convertir Saldo</h2>
      <div className="flex flex-col gap-3">
        <input
          type="number"
          className="border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Cantidad"
          min="0"
        />
        <div className="flex gap-2">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="border p-2 rounded w-1/2">
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="border p-2 rounded w-1/2">
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {exchangeRate !== null && amount > 0 && (
          <div className="text-sm text-gray-600">
            Tasa actual: <strong>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</strong><br />
            Recibirás: <strong>{convertedValue?.toFixed(2)} {toCurrency}</strong>
          </div>
        )}

        <button
          onClick={handleSwap}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Convertir
        </button>
      </div>
    </div>
  );
};

export default Exchange;
