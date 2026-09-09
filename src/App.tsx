import { Route, Routes, Navigate } from 'react-router';
import './App.css';
import MainLayout from './layouts/MainLayout';
import AppMain from './pages/AppMain';
import ServiceApp from './pages/services';
import TourDetail from './pages/TourDetail';
import OurTeamPage from './pages/ourteam';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';
import PromoDetail from './pages/PromoDetail';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      {/* Panel de administración Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Layout público del sitio */}
      <Route element={<MainLayout />}>
        {/* Rutas principales */}
        <Route path="/" element={<AppMain />} />
        <Route path="/services" element={<ServiceApp />} />
        <Route path="/ourteam" element={<OurTeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/promocion" element={<PromoDetail />} />
        <Route path="/promocion/:slug" element={<PromoDetail />} />
        <Route path="/promo" element={<Navigate to="/promocion" replace />} />
        <Route path="/promo/:slug" element={<PromoDetail />} />

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

