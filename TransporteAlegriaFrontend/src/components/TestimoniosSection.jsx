import React from 'react';

const TestimoniosSection = () => {
  const testimonios = [
    {
      id: 1,
      nombre: "María González",
      rol: "Madre de familia",
      testimonio: "El servicio de Transporte Alegría ha sido excelente. Mi hijo llega siempre a tiempo y seguro. ¡Totalmente recomendado!",
      inicial: "M",
      color: "blue"
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      rol: "Padre de familia",
      testimonio: "Los conductores son muy profesionales y los vehículos están impecables. Mi hija se siente muy cómoda.",
      inicial: "C",
      color: "green"
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      rol: "Estudiante",
      testimonio: "Me encanta viajar en el bus de Transporte Alegría. Es divertido y siempre llegamos a tiempo al colegio.",
      inicial: "A",
      color: "purple"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      purple: "bg-purple-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="testimonios" className="py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestras familias
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Testimonios reales de padres y estudiantes que confían en nuestro servicio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonios.map((testimonio) => (
            <div key={testimonio.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${getColorClasses(testimonio.color)} rounded-full flex items-center justify-center mr-4`}>
                  <span className="text-white font-semibold">{testimonio.inicial}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonio.nombre}</h4>
                  <p className="text-gray-600 text-sm">{testimonio.rol}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "{testimonio.testimonio}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniosSection;
