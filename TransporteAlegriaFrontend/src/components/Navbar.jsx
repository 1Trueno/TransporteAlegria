import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/LogoTP.png";
import { useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegistroClick = () => {
    navigate("/registro");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Cierra el menú en móvil al hacer clic
    }
  };

  // Esta funcion hace que el hash no se vea en la url y me los maneja
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      const inicio = document.getElementById("inicio");
      if (inicio) {
        inicio.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <nav className="w-full bg-white shadow-md z-10 fixed top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <button
              onClick={() => {
                const inicio = document.getElementById("inicio");
                if (inicio) {
                  inicio.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex-shrink-0 flex items-center space-x-2 "
            >
              <img
                src={logo}
                alt="LogoTP"
                className="w-15 h-15 mr-3 rounded-lg object-cover"
              />
              <span className="text-2xl font-semibold text-blue-500 cursor-pointer">
                Transporte
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                Alegría
              </span>
            </button>
          </div>

          {/* Navegación central
          en ves de colocar multples botones con un map el lo hace mas rapido */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              {["inicio", "servicios", "testimonios", "contactos"].map(
                (item) => (
                  <button
                    key={item}
                    className="nav-button relative text-gray-700 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                    onClick={() => scrollToSection(item)}
                  >
                    {/* Capitaliza la primera letra del navbar y los spans son los hovers personalizados que tenemos en la pagina*/}
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <span className="line-bottom-h"></span>
                    <span className="line-bottom-v"></span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Botones de acción (solo desktop) */}
          <div className="hidden md:flex items-center space-x-3.5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-medium transition-colors"
              onClick={handleRegistroClick}
            >
              Inscríbete
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors"
              onClick={handleLoginClick}
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Boton de Hamburgesa (solo movil) */}

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={handleMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {/* Icono de menú hamburguesa */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12" // Icono de "X" cuando el menú está abierto
                      : "M4 6h16M4 12h16M4 18h16" // Icono de hamburguesa cuando el menú está cerrado
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable (solo móvil) */}
      <div
        className={`md:hidden absolute top-16 rigth-0 w-full transform transition-transform duration-300 ease-in-out
         ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white shadow-lg`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">

            {/* Mapeo de los botones del navbar */}
          {["inicio", "servicios", "testimonios", "contactos"].map((item) => (
            <button
              key={item}
              className="w-full text-center py-2 text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
              onClick={() => scrollToSection(item)}
            >

              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          
          <div className="flex flex-col space-y-2 w-full px-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-medium transition-colors"
              onClick={handleRegistroClick}
            >
              Inscríbete
            </button>
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors"
              onClick={handleLoginClick}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
