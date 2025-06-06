import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ConfirmAccount = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Esperando confirmación...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      try {
        const response = await fetch(`https://proyectofinalutn-production.up.railway.app/email/confirm/${token}`);
        const data = await response.json();
        if (response.ok) {
          setSuccess(true);
          setMessage("✅ Cuenta confirmada correctamente. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setSuccess(false);
          setMessage("❌ " + data.error);
        }
      } catch (err) {
        setSuccess(false);
        setMessage("❌ Error al confirmar la cuenta.");
      }
      setLoading(false);
    };

    if (token) confirm();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center border border-blue-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Confirmación de Cuenta</h2>

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-3xl" />
            <p className="text-blue-600 text-sm">Cargando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {success ? (
              <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-4xl" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-4xl" />
            )}
            <p className="text-gray-700 font-medium">{message}</p>
            {!success && (
              <button
                onClick={() => navigate("/login")}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                Ir al login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccount;
