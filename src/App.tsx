import { Route, Routes, Navigate } from 'react-router';
import './App.css';
import MainLayout from './layouts/MainLayout';
import AppMain from './pages/AppMain';
import ServiceApp from './pages/services';
import TourDetail from './pages/TourDetail';
import OurTeamPage from './pages/ourteam';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Rutas principales */}
        <Route path="/" element={<AppMain />} />
        <Route path="/services" element={<ServiceApp />} />
        <Route path="/ourteam" element={<OurTeamPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Ruta dinámica para destinos y tours */}
        <Route path="/tours/:slug" element={<TourDetail />} />

        {/* Redirecciones de compatibilidad con rutas previas */}
        <Route path="/peritomoreno" element={<Navigate to="/tours/perito-moreno" replace />} />
        <Route path="/elchalten" element={<Navigate to="/tours/el-chalten" replace />} />
        <Route path="/citytour" element={<Navigate to="/tours/city-tour" replace />} />

        {/* Página 404 para cualquier ruta no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

