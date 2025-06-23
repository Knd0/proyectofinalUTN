// Importación de React (necesaria para JSX)
import React from 'react';

// Componente funcional para mostrar mensaje de éxito luego de un pago
const Success = () => {
  return (
    <div className="text-center p-4">
      {/* Título con mensaje principal */}
      <h2 className="text-2xl font-bold mb-4">¡Pago aprobado!</h2>

      {/* Mensaje secundario de confirmación */}
      <p>Gracias por cargar saldo en tu billetera virtual.</p>

      {/* Comentario para futura lógica, por ejemplo: actualizar saldo en tiempo real */}
      {/* Podés agregar lógica para consultar estado o actualizar UI */}
    </div>
  );
};

// Exporta el componente para ser usado en otras partes de la app
export default Success;
