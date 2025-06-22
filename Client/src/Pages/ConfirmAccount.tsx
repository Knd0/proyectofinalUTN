// Página que maneja la confirmación de cuenta a través de un token en la URL

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Íconos de FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ConfirmAccount = () => {
  const { token } = useParams(); // Extrae el token de la URL
  const [message, setMessage] = useState("Esperando confirmación...");
  const [loading, setLoading] = useState(true); // Estado de carga
  const [success, setSuccess] = useState<boolean | null>(null); // Estado del resultado
  const navigate = useNavigate();

  // Efecto que se ejecuta una sola vez al montar el componente
  useEffect(() => {
    const confirm = async () => {
      try {
        const response = await fetch(`https://proyectofinalutn-production.up.railway.app/email/confirm/${token}`);
        const data = await response.json();

        if (response.ok) {
          // Confirmación exitosa
          setSuccess(true);
          setMessage("✅ Cuenta confirmada correctamente. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 3000); // Redirige después de 3 segundos
        } else {
          // Error del servidor (token inválido o expirado)
          setSuccess(false);
          setMessage("❌ " + data.error);
        }
      } catch (err) {
        // Error de red o inesperado
        setSuccess(false);
        setMessage("❌ Error al confirmar la cuenta.");
      }
      setLoading(false); // Finaliza la carga
    };

    if (token) confirm(); // Ejecuta la función si hay token
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center border border-blue-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Confirmación de Cuenta</h2>

        {loading ? (
          // Vista de carga mientras espera la respuesta
          <div className="flex flex-col items-center gap-2">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-3xl" />
            <p className="text-blue-600 text-sm">Cargando...</p>
          </div>
        ) : (
          // Resultado: éxito o error
          <div className="flex flex-col items-center gap-4">
            {success ? (
              <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-4xl" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-4xl" />
            )}
            <p className="text-gray-700 font-medium">{message}</p>

            {/* Si falló la confirmación, muestra botón para ir al login */}
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
