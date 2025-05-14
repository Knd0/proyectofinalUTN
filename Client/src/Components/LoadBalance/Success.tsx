// Success.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const amount = Number(query.get("amount"));
    const currency = query.get("currency");
    const userId = query.get("userId");
    const token = localStorage.getItem("token");

    if (!amount || !currency || !token) return;

    const creditBalance = async () => {
      await fetch("http://localhost:5000/auth/balance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency }),
      });

      navigate("/home");
    };

    creditBalance();
  }, [location, navigate]);

  return (
    <div className="text-white text-center mt-20">
      <h1 className="text-3xl font-bold">Pago exitoso 🎉</h1>
      <p>Redirigiendo...</p>
    </div>
  );
};

export default Success;
