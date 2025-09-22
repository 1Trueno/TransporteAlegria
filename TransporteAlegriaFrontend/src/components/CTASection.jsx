import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleRegistroClick = () => {
    navigate('/registro');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <section className="py-18 -mt-12 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para unirte a Transporte Alegría?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Únete a cientos de familias que ya confían en nuestro servicio de transporte escolar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRegistroClick}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            🚌 Inscribirse Gratis
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-transparent hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border-2 border-white transform hover:scale-105"
          >
            🔑 Acceder a mi cuenta
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
