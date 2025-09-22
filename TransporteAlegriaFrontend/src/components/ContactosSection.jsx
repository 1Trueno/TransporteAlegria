import React from 'react';

const ContactosSection = () => {
  const contactos = [
    {
      id: 1,
      titulo: "Teléfono",
      valor: "+1 (829)-554-9650",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: "blue"
    },
    {
      id: 2,
      titulo: "Email",
      valor: "transportealegria@gmail.com",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "green"
    },
    {
      id: 3,
      titulo: "Dirección",
      valor: "Rep.Dom, Santo Domingo Este",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
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
    <section id="contactos" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Estamos aquí para responder todas tus preguntas sobre nuestro servicio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactos.map((contacto) => (
            <div key={contacto.id} className="text-center">
              <div className={`w-16 h-16 ${getColorClasses(contacto.color)} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {contacto.icono}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {contacto.titulo}
              </h3>
              <p className="text-gray-300">
                {contacto.valor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactosSection;

