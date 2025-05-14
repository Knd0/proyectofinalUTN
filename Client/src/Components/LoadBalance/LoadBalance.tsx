// LoadBalance.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/loader';

const LoadBalance: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const currencyOptions = ['ARS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT'];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (amount <= 0) {
    setError('La cantidad debe ser mayor que cero.');
    return;
  }

  setLoading(true);

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    const response = await fetch('https://proyectofinalutn-production.up.railway.app/auth/create-preference', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Error al crear preferencia de pago');
    }

    window.location.href = data.init_point; // Redirige a Mercado Pago
  } catch (error) {
    setError('Hubo un problema al iniciar el pago.');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-20">
      <h2 className="text-4xl font-bold mb-6">Cargar Balance</h2>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-1/2">
        <div className="mb-4">
          <label htmlFor="currency" className="block text-lg mb-2">Selecciona la moneda</label>
          <select
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
          >
            {currencyOptions.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-lg mb-2">Cantidad a cargar</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Ingrese la cantidad"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition w-full"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar Balance'}
          </button>
        </div>
      </form>

      <button
        onClick={() => navigate('/home')}
        className="mt-6 text-blue-500 hover:underline"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default LoadBalance;
