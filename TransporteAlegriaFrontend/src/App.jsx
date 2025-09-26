import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import DashboardAdmin from "./components/DashboardAdmin.jsx";
import DashboardPadre from "./components/DashboardPadre.jsx";

import { getCurrentUser, isAuthenticated } from "./services/api.js";
// Importar componentes

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const u = await getCurrentUser();
          setUser(u);
        } catch (error) {
          console.error("Error obteniendo Usuario:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-300">
      <Router>
        {/* Rutas de navegacion*/}
        <Routes>
          {/* Home*/}
          <Route
            path="/"
            element={
              <div>
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

          {/*Login*/}
          <Route
            path="/login"
            element={
              <div>
                <Login />
              </div>
            }
          />
          {/*Registro*/}
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
              user?.role == "admin" ? <DashboardAdmin /> : <DashboardPadre />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
