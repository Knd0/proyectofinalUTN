// Página de inicio de la aplicación: muestra características clave y llamados a la acción
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos'; // Librería para animaciones al hacer scroll
import 'aos/dist/aos.css'; // Estilos de AOS

// Imágenes usadas en la landing
import conexion from "../Images/conexion.jpg";
import finanzas from "../Images/finanzas-digitales.jpg";
import graficos from "../Images/graficos-financieros.jpg";
import historial from "../Images/historial-financiero.jpg";
import transacciones from "../Images/transacciones.jpg";

const Landing: React.FC = () => {
  // Inicializa AOS cuando el componente se monta
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de animaciones (ms)
      once: true      // Solo se ejecutan una vez
    });
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      
      {/* Encabezado de la página */}
      <header 
        className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center fade-in" 
        data-aos="fade-down"
      >
        <h1 className="text-2xl font-bold">Wamoney</h1>
      </header>

      {/* Sección principal con mensaje de valor y botón de acción */}
      <section 
        className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center fade-in" 
        data-aos="fade-up"
      >
        <div className="md:w-1/2">
          <h2 className="text-5xl font-bold mb-6">
            Tu dinero, <span className="text-blue-500">en control total</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Gestioná tu dinero y criptomonedas desde un solo lugar. Transferí, cambiá y revisá tu actividad con total seguridad.
          </p>
          <div className="flex gap-4">
            {/* Botones para registro e inicio de sesión */}
            <Link to="/register" className="bg-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
              Empezar ahora
            </Link>
            <Link to="/login" className="border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Imagen ilustrativa */}
        <div className="md:w-1/2 mt-10 md:mt-0" data-aos="fade-left">
          <img src={finanzas} alt="Finanzas Digitales" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Sección de características clave */}
      <section className="bg-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 fade-in">

          {/* Módulo: Multimoneda */}
          <div className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition" data-aos="fade-up">
            <h3 className="text-xl font-semibold mb-2">Depósito Multimoneda</h3>
            <p className="text-gray-300">
              Cargá saldo en pesos, dólares, euros y criptomonedas como Bitcoin o Ethereum. Todo en una sola cuenta.
            </p>
            <img src={transacciones} alt="Transacciones" className="mt-4 rounded-lg shadow-md" />
          </div>

          {/* Módulo: Cambio de divisas */}
          <div className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition" data-aos="fade-up">
            <h3 className="text-xl font-semibold mb-2">Cambio en Tiempo Real</h3>
            <p className="text-gray-300">
              Convertí entre monedas al instante usando los valores de mercado actualizados minuto a minuto.
            </p>
            <img src={graficos} alt="Gráficos Financieros" className="mt-4 rounded-lg shadow-md" />
          </div>

          {/* Módulo: Transferencias P2P */}
          <div className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition" data-aos="fade-up">
            <h3 className="text-xl font-semibold mb-2">Transferencias P2P</h3>
            <p className="text-gray-300">
              Enviá y recibí dinero con otros usuarios de forma rápida y segura, sin intermediarios.
            </p>
            <img src={conexion} alt="Conexión" className="mt-4 rounded-lg shadow-md" />
          </div>

        </div>
      </section>

      {/* Sección: Visualización de historial */}
      <section 
        className="max-w-6xl mx-auto px-6 py-20 fade-in grid md:grid-cols-2 gap-10 items-center" 
        data-aos="fade-up"
      >
        <div>
          <img src={historial} alt="Historial Financiero" className="rounded-lg shadow-lg" />
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-4">Historial completo y transparente</h3>
          <p className="text-gray-300 mb-4">
            Visualizá todas tus transacciones: cambios de divisa, transferencias P2P y recargas. Cada operación queda registrada con fecha, hora y detalle.
          </p>
          <p className="text-gray-300">
            Nuestra app prioriza la seguridad y transparencia. Todo tu historial está protegido y solo accesible para vos.
          </p>
        </div>
      </section>

      {/* Footer final con CTA */}
      <footer className="bg-gray-800 text-center py-12 px-6 fade-in" data-aos="fade-up">
        <h4 className="text-2xl font-bold mb-4">¿Listo para tomar el control de tu dinero?</h4>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Crear cuenta gratis
        </Link>
        <p className="text-gray-400 mt-4">Sin costos ocultos. Sin complicaciones. 100% digital.</p>
      </footer>
    </div>
  );
};

export default Landing;
