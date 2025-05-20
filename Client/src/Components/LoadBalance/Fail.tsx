import React from "react";

const Fail: React.FC = () => {
  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Pago no aprobado</h2>
      <p>Lo sentimos, hubo un problema al procesar tu pago.</p>
      <p>Por favor, intenta nuevamente o contacta con soporte.</p>
      <button
        onClick={() => window.location.href = "/loadbalance"}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Volver a cargar saldo
      </button>
    </div>
  );
};

export default Fail;
