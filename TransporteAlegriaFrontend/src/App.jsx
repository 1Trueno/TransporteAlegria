import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import Login from "./components/Login.jsx";
import Registro from "./components/Registro.jsx";
import Footer from "./components/Footer.jsx";
import ServiciosSection from "./components/ServiciosSection.jsx";
import TestimoniosSection from "./components/TestimoniosSection.jsx";
import ContactosSection from "./components/ContactosSection.jsx";
import CTASection from "./components/CTASection.jsx";
import Dashboard from "./components/Dashboard.jsx";

// Importar componentes

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-300">
      <Router>
        <Routes>
          {/* Rutas de navegacion*/}
          <Route
            path="/"
            element={
              <div>
                {/* Home*/}
                <Navbar />
                <HeroSection />
                <CTASection />
                <ServiciosSection />
                <TestimoniosSection />
                <ContactosSection />
                <Footer />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div>
                <Login />
              </div>
            }
          />
          <Route
            path="/registro"
            element={
              <div>
                <Registro />
              </div>
            }
          />
          {/* Otras rutas */}
          <Route
            path="/dashboard" 
            element={
            <div>
              <Dashboard /> 
            </div>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
