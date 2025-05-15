import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          navigate("/home");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleRedirectNow = () => {
    navigate("/home");
  };

  return (
    <div className="text-white text-center mt-20 px-4">
      <h1 className="text-4xl font-bold mb-4">¡Pago exitoso 🎉!</h1>
      <p className="text-lg mb-6">Tu saldo se acreditará automáticamente.</p>
      <p className="mb-6">Serás redirigido en {secondsLeft} segundos...</p>
      <button
        onClick={handleRedirectNow}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        Ir ahora
      </button>
    </div>
  );
};

export default Success;
