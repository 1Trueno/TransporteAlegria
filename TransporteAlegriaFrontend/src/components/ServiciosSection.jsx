import React from 'react';

const ServiciosSection = () => {
  const servicios = [
    {
      id: 1,
      titulo: "Rutas Personalizadas",
      descripcion: "Diseñamos rutas optimizadas para cada estudiante, considerando su ubicación y horarios escolares.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      color: "blue"
    },
    {
      id: 2,
      titulo: "Seguridad Garantizada",
      descripcion: "Conductores certificados, vehículos modernos y sistemas de monitoreo en tiempo real.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green"
    },
    {
      id: 3,
      titulo: "Puntualidad",
      descripcion: "Llegamos siempre a tiempo, respetando los horarios escolares y la agenda de las familias.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-50 to-indigo-100 bg-blue-600",
      green: "from-green-50 to-emerald-100 bg-green-600",
      purple: "from-purple-50 to-pink-100 bg-purple-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="servicios" className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-18">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-9">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales de transporte escolar para garantizar la seguridad y comodidad de nuestros estudiantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((servicio) => (
            <div 
              key={servicio.id}
              className={`bg-gradient-to-br ${getColorClasses(servicio.color).split(' ')[0]} ${getColorClasses(servicio.color).split(' ')[1]} p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${getColorClasses(servicio.color).split(' ')[2]} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {servicio.icono}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiciosSection;
