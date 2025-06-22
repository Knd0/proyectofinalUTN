// Importación de React para usar JSX y definir componentes funcionales
import React from "react";

// Componente funcional Fail, que se muestra cuando el pago no es aprobado
const Fail: React.FC = () => {
  return (
    <div className="text-center p-4">
      {/* Título del mensaje de error */}
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Pago no aprobado
      </h2>

      {/* Mensaje de explicación al usuario */}
      <p>Lo sentimos, hubo un problema al procesar tu pago.</p>
      <p>Por favor, intenta nuevamente o contacta con soporte.</p>

      {/* Botón para volver a la pantalla de recarga */}
      <button
        onClick={() => window.location.href = "/loadbalance"} // Redirige a la ruta de carga de saldo
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Volver a cargar saldo
      </button>
    </div>
  );
};

// Exportación del componente para su uso en otras partes de la app
export default Fail;
