import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type {
  Tour,
  ReservationItem,
  Promotion,
  TourAvailability,
  DashboardStats,
  TabType,
  Advertising,
  Vehicle,
} from '../../types';
import {
  tourService,
  reservationService,
  promotionService,
  availabilityService,
  advertisingService,
  vehicleService,
} from '../../services';
import { CreateTourModal } from '../../components/create_tour_modal';
import { CreateAdModal } from '../../components/create_ad_modal';
import { CreatePromoModal } from '../../components/create_promo_modal';
import './Dashboard.css';

// Helper de resolución de imagen para publicidades
const getAdImageSrc = (imgPath?: string) => {
  if (!imgPath || typeof imgPath !== 'string') return '';
  if (
    imgPath.startsWith('http://') ||
    imgPath.startsWith('https://') ||
    imgPath.startsWith('data:') ||
    imgPath.startsWith('blob:') ||
    imgPath.startsWith('/')
  ) {
    return imgPath;
  }
  try {
    return new URL(`../../assets/${imgPath}`, import.meta.url).href;
  } catch {
    return imgPath;
  }
};

// Helper de categorías con iconos y etiquetas estilizadas
const getAdCategoryBadge = (category?: string) => {
  switch (category) {
    case 'comida':
      return { label: 'Gastronomía', icon: 'fi fi-rr-utensils', className: 'cat-comida' };
    case 'bar':
      return { label: 'Bar / Cervecería', icon: 'fi fi-rr-beer', className: 'cat-bar' };
    case 'tienda_ropa':
      return { label: 'Tienda de Ropa', icon: 'fi fi-rr-shop', className: 'cat-tienda' };
    case 'excursion':
      return { label: 'Excursión / Aventura', icon: 'fi fi-rr-hiking', className: 'cat-excursion' };
    default:
      return { label: 'Comercio Local', icon: 'fi fi-rr-star', className: 'cat-otro' };
  }
};

// Formateo de URLs para canales de contacto
const formatChannelUrl = (network: string, handleOrUrl?: string) => {
  if (!handleOrUrl || typeof handleOrUrl !== 'string') return '#';
  const trimmed = handleOrUrl.trim();
  if (!trimmed) return '#';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const clean = trimmed.replace(/^@/, '').trim();
  if (network === 'web') return `https://${clean}`;
  if (network === 'instagram') return `https://instagram.com/${clean}`;
  if (network === 'tiktok') return `https://tiktok.com/@${clean}`;
  if (network === 'facebook') return `https://facebook.com/${clean}`;
  return `https://${clean}`;
};


export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [availabilities, setAvailabilities] = useState<TourAvailability[]>([]);
  const [ads, setAds] = useState<Advertising[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado para modal de crear tour
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);

  // Estado para modal de crear/editar publicidad
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [adToEdit, setAdToEdit] = useState<Advertising | null>(null);

  // Estado para modal de crear/editar promoción
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState<Promotion | null>(null);

  // Filtros de reservas
  const [resFilter, setResFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [resSearch, setResSearch] = useState('');

  // Estado para nuevo bloqueo de disponibilidad
  const [newAvailTourId, setNewAvailTourId] = useState('');
  const [newAvailDate, setNewAvailDate] = useState('');
  const [newAvailMaxSeats, setNewAvailMaxSeats] = useState(19);
  const [newAvailBlocked, setNewAvailBlocked] = useState(false);
  const [newAvailNotes, setNewAvailNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [toursData, resData, promosList, availData, adsData, vehiclesData] = await Promise.all([
        tourService.getAll(),
        reservationService.getAll(),
        promotionService.getAll(),
        availabilityService.getAll(),
        advertisingService.getAll(),
        vehicleService.getAll(),
      ]);
      setTours(toursData);
      setReservations(resData);
      setPromotions(promosList);
      setAvailabilities(availData);
      setAds(adsData);
      setVehicles(vehiclesData);
      if (toursData.length > 0 && !newAvailTourId) {
        setNewAvailTourId(toursData[0].id);
      }
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      showToast('⚠️ Datos cargados en modo local sincronizado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Calcular métricas
  const stats: DashboardStats = {
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((r) => r.status === 'PENDING').length,
    confirmedReservations: reservations.filter((r) => r.status === 'CONFIRMED').length,
    activeTours: tours.length,
    promosActiveCount: promotions.filter((p) => p.isActive).length,
    estimatedRevenue: reservations
      .filter((r) => r.status === 'CONFIRMED')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
  };

  // Abrir modal de creación de promo
  const handleOpenCreatePromo = () => {
    setPromoToEdit(null);
    setShowPromoModal(true);
  };

  // Abrir modal de edición de promo
  const handleOpenEditPromo = (promo: Promotion) => {
    setPromoToEdit(promo);
    setShowPromoModal(true);
  };

  // Conmutar estado activo de una promo
  const handleTogglePromoActive = async (id: string) => {
    try {
      const updated = await promotionService.toggleActive(id);
      showToast(updated.isActive ? '🟢 Promoción activada' : '⚪ Promoción desactivada');
      loadAllData();
    } catch (err) {
      console.error('Error al conmutar estado de promo:', err);
      showToast('❌ Error al cambiar estado');
    }
  };

  // Eliminar una promo
  const handleDeletePromo = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar permanentemente la promoción "${title}"?`)) {
      try {
        await promotionService.delete(id);
        showToast('🗑️ Promoción eliminada');
        loadAllData();
      } catch (err) {
        console.error('Error al eliminar promo:', err);
        showToast('❌ Error al eliminar promoción');
      }
    }
  };

  // Abrir modal para crear publicidad
  const handleOpenCreateAd = () => {
    setAdToEdit(null);
    setShowCreateAdModal(true);
  };

  // Abrir modal para editar publicidad
  const handleOpenEditAd = (ad: Advertising) => {
    setAdToEdit(ad);
    setShowCreateAdModal(true);
  };

  // Conmutar visibilidad activa de una publicidad
  const handleToggleAdActive = async (id: string) => {
    try {
      const updated = await advertisingService.toggleActive(id);
      showToast(updated.isActive ? '🟢 Visibilidad activada' : '⚪ Publicidad pausada');
      window.dispatchEvent(new Event('ads_updated'));
      loadAllData();
    } catch (err) {
      console.error('Error al cambiar visibilidad:', err);
      showToast('❌ Error al cambiar visibilidad');
    }
  };

  // Eliminar una publicidad
  const handleDeleteAd = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar permanentemente la publicidad de "${title}"?`)) {
      try {
        await advertisingService.delete(id);
        showToast('🗑️ Publicidad eliminada');
        window.dispatchEvent(new Event('ads_updated'));
        loadAllData();
      } catch (err) {
        console.error('Error al eliminar publicidad:', err);
        showToast('❌ Error al eliminar publicidad');
      }
    }
  };

  // Guardar cambios en un tour
  const handleSaveTour = async (tour: Tour) => {
    try {
      await tourService.update(tour.id, tour);
      showToast(`✅ Tour "${tour.title}" actualizado con éxito en el backend`);
      loadAllData();
    } catch (err) {
      console.error('Error actualizando tour:', err);
      showToast('❌ Error al actualizar el tour');
    }
  };

  // Cambiar estado de una reserva
  const handleStatusChange = async (
    id: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  ) => {
    try {
      await reservationService.updateStatus(id, newStatus);
      showToast(`✅ Reserva actualizada a estado ${newStatus}`);
      loadAllData();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      showToast('❌ Error al cambiar estado de reserva');
    }
  };

  // Eliminar reserva
  const handleDeleteReservation = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        await reservationService.delete(id);
        showToast('🗑️ Reserva eliminada correctamente');
        loadAllData();
      } catch (err) {
        console.error('Error al eliminar reserva:', err);
        showToast('❌ Error al eliminar reserva');
      }
    }
  };

  // Guardar nueva disponibilidad / bloqueo
  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvailTourId || !newAvailDate) {
      showToast('⚠️ Completa el tour y la fecha');
      return;
    }

    try {
      await availabilityService.upsert({
        tourId: newAvailTourId,
        date: newAvailDate,
        maxSeats: Number(newAvailMaxSeats),
        isBlocked: newAvailBlocked,
        notes: newAvailNotes,
      });
      showToast('✅ Registro de disponibilidad actualizado');
      setNewAvailDate('');
      setNewAvailNotes('');
      loadAllData();
    } catch (err) {
      console.error('Error al guardar disponibilidad:', err);
      showToast('❌ Error al guardar disponibilidad');
    }
  };

  // Conmutar bloqueo de fecha existente
  const handleToggleBlock = async (avail: TourAvailability) => {
    try {
      await availabilityService.toggleBlock(avail.tourId, avail.date, !avail.isBlocked);
      showToast(
        avail.isBlocked
          ? `🟢 Fecha ${avail.date} desbloqueada`
          : `🔴 Fecha ${avail.date} bloqueada`
      );
      loadAllData();
    } catch (err) {
      console.error('Error al conmutar bloqueo:', err);
      showToast('❌ Error al actualizar estado de bloqueo');
    }
  };

  // Filtrado de reservas
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = resFilter === 'ALL' || r.status === resFilter;
    const q = resSearch.toLowerCase();
    const matchesSearch =
      !q ||
      r.passengerName.toLowerCase().includes(q) ||
      r.passengerPhone.toLowerCase().includes(q) ||
      r.passengerEmail.toLowerCase().includes(q) ||
      (r.tourTitle && r.tourTitle.toLowerCase().includes(q)) ||
      r.meetingPoint.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="dash-toast">
          <i className="fi fi-rr-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-icon">
            <i className="fi fi-rr-settings-sliders"></i>
          </div>
          <div className="dash-brand-info">
            <h2>Blue Calafate</h2>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav className="dash-nav">
          <button
            className={`dash-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fi fi-rr-dashboard"></i>
            <span>Resumen</span>
          </button>

          <button
            className={`dash-nav-btn ${activeTab === 'tours' ? 'active' : ''}`}
            onClick={() => setActiveTab('tours')}
          >
            <i className="fi fi-rr-map-marker"></i>
            <span>Tours y Precios</span>
            <span className="dash-badge">{tours.length}</span>
          </button>

          <button
            className={`dash-nav-btn ${activeTab === 'promos' ? 'active' : ''}`}
            onClick={() => setActiveTab('promos')}
          >
            <i className="fi fi-rr-tags"></i>
            <span>Promociones</span>
            {stats.promosActiveCount > 0 && (
              <span className="dash-badge">{stats.promosActiveCount} ON</span>
            )}
          </button>

          <button
            className={`dash-nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <i className="fi fi-rr-book-bookmark"></i>
            <span>Reservas</span>
            {stats.pendingReservations > 0 && (
              <span className="dash-badge" style={{ background: '#f59e0b', color: '#fff' }}>
                {stats.pendingReservations} pend.
              </span>
            )}
          </button>

          <button
            className={`dash-nav-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <i className="fi fi-rr-calendar"></i>
            <span>Disponibilidad</span>
          </button>

          <button
            className={`dash-nav-btn ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <i className="fi fi-rr-bullhorn"></i>
            <span>Publicidad & Comercios</span>
            {ads.length > 0 && (
              <span className="dash-badge">{ads.filter((a) => a.isActive).length} ON</span>
            )}
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/" className="dash-site-link">
            <i className="fi fi-rr-arrow-left"></i>
            <span>Ver Sitio Web</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* Top Header */}
        <header className="dash-topbar">
          <div className="dash-title-wrap">
            <h1>
              {activeTab === 'overview' && 'Panel de Control Principal'}
              {activeTab === 'tours' && 'Gestión de Excursiones y Precios'}
              {activeTab === 'promos' && 'Configuración de Promociones y Alertas'}
              {activeTab === 'ads' && 'Gestión de Publicidad de Empresas y Comercios'}
              {activeTab === 'reservations' && 'Administración de Reservas'}
              {activeTab === 'availability' && 'Disponibilidad y Bloqueo de Fechas'}
            </h1>
            <p>Conectado a la API Backend de Blue Calafate • Sincronización en tiempo real</p>
          </div>

          <div className="dash-topbar-actions">
            <div className="dash-status-pill">
              <span className="status-dot"></span>
              <span>API Conectada</span>
            </div>

            <button
              className="dash-refresh-btn"
              onClick={loadAllData}
              disabled={loading}
              title="Refrescar datos"
            >
              <i className={`fi fi-rr-refresh ${loading ? 'dash-spin' : ''}`}></i>
              <span>{loading ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
          </div>
        </header>

        {/* ======================= TAB: RESUMEN / OVERVIEW ======================= */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="dash-kpi-grid">
              <div className="dash-kpi-card">
                <div className="dash-kpi-icon emerald">
                  <i className="fi fi-rr-dollar"></i>
                </div>
                <div className="dash-kpi-content">
                  <span>Ingresos Estimados</span>
                  <h3>ARS ${stats.estimatedRevenue.toLocaleString('es-AR')}</h3>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon blue">
                  <i className="fi fi-rr-users"></i>
                </div>
                <div className="dash-kpi-content">
                  <span>Total Reservas</span>
                  <h3>{stats.totalReservations}</h3>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon amber">
                  <i className="fi fi-rr-time-forward"></i>
                </div>
                <div className="dash-kpi-content">
                  <span>Pendientes de Confirmar</span>
                  <h3>{stats.pendingReservations}</h3>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon purple">
                  <i className="fi fi-rr-badge-percent"></i>
                </div>
                <div className="dash-kpi-content">
                  <span>Promociones Activas</span>
                  <h3>{stats.promosActiveCount} activas</h3>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Acciones Rápidas</h2>
                  <p>Gestiona los elementos clave de la plataforma</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="dash-btn-primary"
                  onClick={() => setActiveTab('tours')}
                >
                  <i className="fi fi-rr-edit"></i> Modificar Precios de Tours
                </button>
                <button
                  className="dash-btn-secondary"
                  onClick={() => setActiveTab('promos')}
                >
                  <i className="fi fi-rr-tags"></i> Activar / Desactivar Promos
                </button>
                <button
                  className="dash-btn-secondary"
                  onClick={() => setActiveTab('ads')}
                >
                  <i className="fi fi-rr-bullhorn"></i> Publicidad de Empresas
                </button>
                <button
                  className="dash-btn-secondary"
                  onClick={() => setActiveTab('reservations')}
                >
                  <i className="fi fi-rr-list-check"></i> Ver Todas las Reservas
                </button>
                <button
                  className="dash-btn-secondary"
                  onClick={() => setActiveTab('availability')}
                >
                  <i className="fi fi-rr-calendar"></i> Gestionar Cupos y Fechas
                </button>
              </div>
            </div>

            {/* Últimas Reservas */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Últimas Reservas Registradas</h2>
                  <p>Clientes recientes que solicitaron una excursión</p>
                </div>
                <button
                  className="dash-btn-secondary"
                  onClick={() => setActiveTab('reservations')}
                >
                  Ver todas ({reservations.length})
                </button>
              </div>

              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Excursión</th>
                      <th>Fecha</th>
                      <th>Pasajeros</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 5).map((res) => (
                      <tr key={res.id}>
                        <td>
                          <strong>{res.passengerName}</strong>
                          <br />
                          <small style={{ color: '#64748b' }}>{res.passengerPhone}</small>
                        </td>
                        <td>{res.tourTitle || res.tourId}</td>
                        <td>{res.date}</td>
                        <td>{res.passengersCount} pas.</td>
                        <td>
                          {res.totalPrice
                            ? `ARS $${res.totalPrice.toLocaleString('es-AR')}`
                            : 'Consultar'}
                        </td>
                        <td>
                          <span className={`dash-status-badge ${res.status}`}>
                            {res.status === 'CONFIRMED' && 'Confirmada'}
                            {res.status === 'PENDING' && 'Pendiente'}
                            {res.status === 'CANCELLED' && 'Cancelada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: TOURS & PRECIOS ======================= */}
        {activeTab === 'tours' && (
          <div>
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Listado y Modificación de Precios</h2>
                  <p>
                    Edita el valor por persona, horarios y detalles que se reflejan en las páginas de tours.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    className="dash-btn-primary"
                    onClick={() => setShowCreateTourModal(true)}
                  >
                    <i className="fi fi-rr-plus"></i> Agregar Nuevo Tour
                  </button>
                  <button
                    className="dash-btn-secondary"
                    onClick={async () => {
                      await loadAllData();
                      showToast('🔄 Datos sincronizados con el servidor');
                    }}
                  >
                    <i className="fi fi-rr-refresh"></i> Recargar Datos
                  </button>
                </div>
              </div>

              <div className="dash-tours-grid">
                {tours.map((t) => (
                  <div key={t.id} className="dash-tour-edit-card">
                    <div className="dash-tour-header">
                      <div className="dash-tour-title-wrap">
                        <h3>{t.title}</h3>
                        <span>{t.serviceType} • Slug: /{t.slug}</span>
                      </div>
                    </div>

                    <div className="dash-form-row">
                      <div className="dash-input-group">
                        <label>Precio por Persona (Formato visual)</label>
                        <input
                          type="text"
                          className="dash-input"
                          value={t.pricePerPerson}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTours((prev) =>
                              prev.map((item) =>
                                item.id === t.id ? { ...item, pricePerPerson: val } : item
                              )
                            );
                          }}
                        />
                      </div>

                      <div className="dash-input-group">
                        <label>Precio Numérico (ARS)</label>
                        <input
                          type="number"
                          className="dash-input"
                          value={t.priceNumber || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTours((prev) =>
                              prev.map((item) =>
                                item.id === t.id
                                  ? {
                                    ...item,
                                    priceNumber: val,
                                    pricePerPerson: `ARS ${val.toLocaleString('es-AR')}`,
                                    totalExample: `ARS ${(val * 2).toLocaleString('es-AR')}`,
                                  }
                                  : item
                              )
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="dash-form-row">
                      <div className="dash-input-group">
                        <label>Ejemplo Total (2 pax)</label>
                        <input
                          type="text"
                          className="dash-input"
                          value={t.totalExample}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTours((prev) =>
                              prev.map((item) =>
                                item.id === t.id ? { ...item, totalExample: val } : item
                              )
                            );
                          }}
                        />
                      </div>

                      <div className="dash-input-group">
                        <label>Horarios (Salida / Regreso)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            className="dash-input"
                            placeholder="Salida"
                            value={t.departureTime}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTours((prev) =>
                                prev.map((item) =>
                                  item.id === t.id ? { ...item, departureTime: val } : item
                                )
                              );
                            }}
                          />
                          <input
                            type="text"
                            className="dash-input"
                            placeholder="Regreso"
                            value={t.returnTime}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTours((prev) =>
                                prev.map((item) =>
                                  item.id === t.id ? { ...item, returnTime: val } : item
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="dash-form-row">
                      <div className="dash-input-group">
                        <label>Precio Privado VIP Numérico (ARS)</label>
                        <input
                          type="number"
                          className="dash-input"
                          value={t.privatePriceNumber || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTours((prev) =>
                              prev.map((item) =>
                                item.id === t.id
                                  ? {
                                    ...item,
                                    hasPrivateOption: true,
                                    privatePriceNumber: val,
                                    privatePricePerPerson: `ARS ${val.toLocaleString('es-AR')}`,
                                    privateTotalExample: `ARS ${(val * 2).toLocaleString('es-AR')}`,
                                  }
                                  : item
                              )
                            );
                          }}
                        />
                      </div>

                      <div className="dash-input-group">
                        <label>Precio Privado VIP (Visual)</label>
                        <input
                          type="text"
                          className="dash-input"
                          value={t.privatePricePerPerson || ''}
                          placeholder="Ej: ARS 65.000"
                          onChange={(e) => {
                            const val = e.target.value;
                            setTours((prev) =>
                              prev.map((item) =>
                                item.id === t.id ? { ...item, privatePricePerPerson: val } : item
                              )
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="dash-input-group">
                      <label>Frase Descriptiva (Compartido)</label>
                      <input
                        type="text"
                        className="dash-input"
                        value={t.phrase}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTours((prev) =>
                            prev.map((item) =>
                              item.id === t.id ? { ...item, phrase: val } : item
                            )
                          );
                        }}
                      />
                    </div>

                    <div className="dash-input-group">
                      <label>Frase Descriptiva (Privado VIP - Horario a elección)</label>
                      <input
                        type="text"
                        className="dash-input"
                        value={t.privatePhrase || ''}
                        placeholder="Ej: Traslado privado exclusivo con chofer a disposición y horario libre"
                        onChange={(e) => {
                          const val = e.target.value;
                          setTours((prev) =>
                            prev.map((item) =>
                              item.id === t.id ? { ...item, privatePhrase: val } : item
                            )
                          );
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <Link
                        to={`/tours/${t.slug}`}
                        target="_blank"
                        className="dash-btn-secondary"
                      >
                        <i className="fi fi-rr-eye"></i> Ver Página
                      </Link>
                      <button
                        className="dash-btn-primary"
                        onClick={() => handleSaveTour(t)}
                      >
                        <i className="fi fi-rr-disk"></i> Guardar en Backend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: PROMOCIONES ======================= */}
        {activeTab === 'promos' && (
          <div>
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Gestión de Promociones y Paquetes</h2>
                  <p>
                    Crea, activa, desactiva o elimina promociones y paquetes combinados para la página web.
                  </p>
                </div>
                <button className="dash-btn-primary" onClick={handleOpenCreatePromo}>
                  <i className="fi fi-rr-plus"></i> Crear Nueva Promoción
                </button>
              </div>

              {promotions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <i className="fi fi-rr-tags" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '14px', display: 'block' }}></i>
                  <h3>No hay promociones registradas</h3>
                  <p>Crea tu primera promoción para mostrarla en la página web.</p>
                  <button className="dash-btn-primary" onClick={handleOpenCreatePromo} style={{ marginTop: '16px' }}>
                    <i className="fi fi-rr-plus"></i> Crear Primera Promoción
                  </button>
                </div>
              ) : (
                <div className="dash-promos-grid">
                  {promotions.map((p) => {
                    const thumbUrl =
                      p?.image && typeof p.image === 'string' && (p.image.startsWith('http') || p.image.startsWith('/') || p.image.startsWith('data:'))
                        ? p.image
                        : p?.image && typeof p.image === 'string'
                          ? new URL(`../../assets/${p.image}`, import.meta.url).href
                          : '';

                    const cardPrice = Math.round((p.priceNumber || 0) * (1 + (p.creditCardSurcharge || 0) / 100));
                    const assignedVehicle = vehicles.find((v) => v.id === p.vehicleId);

                    return (
                      <div
                        key={p.id}
                        className={`dash-promo-card ${p.isActive ? 'active' : 'inactive'}`}
                      >
                        <div className="dash-promo-top">
                          <img src={thumbUrl} alt={p.title} className="dash-promo-thumb" />
                          <div className="dash-promo-title-area">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3>{p.title}</h3>
                              <span
                                className={`dash-promo-status-pill ${p.isActive ? 'active' : 'inactive'
                                  }`}
                              >
                                {p.isActive ? '🟢 Activa' : '⚪ Inactiva'}
                              </span>
                            </div>
                            <div className="dash-promo-slug">/promocion/{p.slug}</div>
                            <span className="dash-promo-badge-tag">{p.badgeText || 'PROMOCIÓN'}</span>
                          </div>
                        </div>

                        <p className="dash-promo-desc">{p.subtitle}</p>

                        <div className="dash-promo-stats-grid">
                          <div className="dash-promo-stat-box">
                            <span>Efectivo / Transf.</span>
                            <strong>${p.priceNumber.toLocaleString('es-AR')}</strong>
                          </div>
                          <div className="dash-promo-stat-box">
                            <span>Con Tarjeta (+{p.creditCardSurcharge}%)</span>
                            <strong>${cardPrice.toLocaleString('es-AR')}</strong>
                          </div>
                          <div className="dash-promo-stat-box">
                            <span>Vehículo y Capacidad</span>
                            <strong>
                              {assignedVehicle ? `${assignedVehicle.name} (${assignedVehicle.capacity} pax)` : `${p.passengersCount} personas`}
                            </strong>
                          </div>
                        </div>

                        {/* Tours incluidos */}
                        {((p.includedTourIds && p.includedTourIds.length > 0) || (p.includes && p.includes.length > 0)) && (
                          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '12px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              <i className="fi fi-rr-map-marker-check" style={{ marginRight: '6px', color: '#0284c7' }}></i>
                              Tours Incluidos:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                              {p.includedTourIds && p.includedTourIds.length > 0
                                ? p.includedTourIds.map((tId) => {
                                    const tourObj = tours.find((t) => t.id === tId);
                                    return (
                                      <span
                                        key={tId}
                                        style={{
                                          fontSize: '11px',
                                          background: '#ffffff',
                                          border: '1px solid #cbd5e1',
                                          padding: '2px 8px',
                                          borderRadius: '6px',
                                          color: '#1e293b',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {tourObj ? tourObj.title : tId}
                                      </span>
                                    );
                                  })
                                : (p.includes || []).map((inc, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: '11px',
                                        background: '#ffffff',
                                        border: '1px solid #cbd5e1',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        color: '#1e293b',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {inc}
                                    </span>
                                  ))}
                            </div>
                          </div>
                        )}

                        <div className="dash-promo-switches" style={{ marginTop: '14px' }}>
                          <div className="dash-promo-switch-item">
                            <label className="dash-toggle" style={{ transform: 'scale(0.8)' }}>
                              <input
                                type="checkbox"
                                checked={p.isActive}
                                onChange={() => handleTogglePromoActive(p.id)}
                              />
                              <span className="dash-toggle-slider"></span>
                            </label>
                            <span>{p.isActive ? 'Publicada' : 'Pausada'}</span>
                          </div>

                          <div className="dash-promo-switch-item">
                            <span>Modal Inicio:</span>
                            <strong>{p.showHomeModal ? '✅ Sí' : '❌ No'}</strong>
                          </div>
                        </div>

                        <div className="dash-promo-actions">
                          <Link
                            to="/promocion"
                            target="_blank"
                            className="dash-btn-secondary"
                            style={{ padding: '8px 14px', fontSize: '13px' }}
                          >
                            <i className="fi fi-rr-eye"></i> Ver Web
                          </Link>
                          <button
                            className="dash-btn-secondary"
                            onClick={() => handleOpenEditPromo(p)}
                            style={{ padding: '8px 14px', fontSize: '13px' }}
                          >
                            <i className="fi fi-rr-pencil"></i> Editar
                          </button>
                          <button
                            className="dash-btn-danger"
                            onClick={() => handleDeletePromo(p.id, p.title)}
                            style={{ padding: '8px 14px', fontSize: '13px' }}
                          >
                            <i className="fi fi-rr-trash"></i> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal para Crear o Editar Promoción */}
            <CreatePromoModal
              isOpen={showPromoModal}
              onClose={() => setShowPromoModal(false)}
              onPromoSaved={() => {
                showToast(promoToEdit ? '✅ Promoción actualizada con éxito' : '✅ Nueva promoción creada con éxito');
                loadAllData();
              }}
              promoToEdit={promoToEdit}
              vehicles={vehicles}
              tours={tours}
            />
          </div>
        )}

        {/* ======================= TAB: COMERCIOS & PUBLICIDAD ======================= */}
        {activeTab === 'ads' && (
          <div>
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Publicidad de Empresas y Comercios Locales</h2>
                  <p>
                    Administra los comercios locales recomendados (comida, bares, tiendas de ropa, excursiones) y controla su visibilidad en la plataforma.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button className="dash-btn-primary" onClick={handleOpenCreateAd}>
                    <i className="fi fi-rr-plus"></i> Nueva Publicidad
                  </button>
                  <button
                    className="dash-btn-secondary"
                    onClick={async () => {
                      await loadAllData();
                      showToast('🔄 Publicidades sincronizadas');
                    }}
                  >
                    <i className="fi fi-rr-refresh"></i> Recargar
                  </button>
                </div>
              </div>

              {ads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <i
                    className="fi fi-rr-bullhorn"
                    style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '14px', display: 'block' }}
                  ></i>
                  <h3>No hay publicidades registradas</h3>
                  <p>Agrega la primera publicidad comercial para promocionarla a los turistas.</p>
                  <button
                    className="dash-btn-primary"
                    onClick={handleOpenCreateAd}
                    style={{ marginTop: '16px' }}
                  >
                    <i className="fi fi-rr-plus"></i> Crear Primera Publicidad
                  </button>
                </div>
              ) : (
                <div className="dash-ads-grid">
                  {ads.map((ad) => {
                    const thumbUrl = getAdImageSrc(ad?.image);
                    const catInfo = getAdCategoryBadge(ad?.category || 'otro');
                    const hasWeb = typeof ad?.linkPage === 'string' && ad.linkPage.trim().length > 0;
                    const socialList = Array.isArray(ad?.socialMedia) ? ad.socialMedia : [];

                    return (
                      <div
                        key={ad.id}
                        className={`dash-ad-card ${ad.isActive ? 'active' : 'inactive'}`}
                      >
                        {/* Cover Image & Floating Badges */}
                        <div className="dash-ad-cover">
                          <img
                            src={thumbUrl}
                            alt={ad.title || 'Publicidad'}
                            className="dash-ad-cover-img"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = 'true';
                                target.src = new URL('../../assets/estancias.jpeg', import.meta.url).href;
                              }
                            }}
                          />
                          <div className="dash-ad-cover-overlay"></div>
                          <div className="dash-ad-cover-top">
                            <span className={`dash-ad-category-badge ${catInfo.className}`}>
                              <i className={catInfo.icon}></i>
                              <span>{catInfo.label}</span>
                            </span>
                            <span
                              className={`dash-ad-status-pill ${
                                ad.isActive ? 'active' : 'inactive'
                              }`}
                            >
                              <span className="dash-ad-status-dot"></span>
                              <span>{ad.isActive ? 'Visible' : 'Oculta'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="dash-ad-body">
                          <h3 className="dash-ad-title">{ad.title}</h3>
                          {ad.location && (
                            <div className="dash-ad-location">
                              <i className="fi fi-rr-marker"></i>
                              <span>{ad.location}</span>
                            </div>
                          )}

                          {ad.slogan && (
                            <div className="dash-ad-slogan-box">
                              <p className="dash-ad-slogan-text">"{ad.slogan}"</p>
                            </div>
                          )}

                          {/* Canales de contacto configurados */}
                          <div className="dash-ad-channels-row">
                            {hasWeb && (
                              <a
                                href={formatChannelUrl('web', ad.linkPage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dash-ad-channel-badge web"
                                title={`Página web oficial de ${ad.title}`}
                              >
                                <i className="fi fi-rr-globe"></i>
                                <span>Web Oficial</span>
                              </a>
                            )}

                            {socialList.map((sm, idx) => {
                              let iconClass = 'fi fi-rr-share';
                              if (sm?.network === 'instagram') iconClass = 'fi fi-brands-instagram';
                              if (sm?.network === 'tiktok') iconClass = 'fi fi-brands-tik-tok';
                              if (sm?.network === 'facebook') iconClass = 'fi fi-brands-facebook';

                              const handleStr = typeof sm?.handle === 'string' ? sm.handle.trim() : '';
                              if (!handleStr) return null;
                              const displayHandle = handleStr.startsWith('@') ? handleStr : `@${handleStr}`;

                              return (
                                <a
                                  key={`${sm?.network || 'social'}-${idx}`}
                                  href={formatChannelUrl(sm?.network || 'instagram', handleStr)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`dash-ad-channel-badge ${sm?.network || 'instagram'}`}
                                  title={`${sm?.network || 'Red Social'} de ${ad.title}: ${handleStr}`}
                                >
                                  <i className={iconClass}></i>
                                  <span>{displayHandle}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>

                        {/* Card Footer: Toggle & Actions */}
                        <div className="dash-ad-footer">
                          <div className="dash-ad-visibility-control">
                            <label className="dash-toggle" style={{ transform: 'scale(0.8)' }}>
                              <input
                                type="checkbox"
                                checked={ad.isActive}
                                onChange={() => handleToggleAdActive(ad.id)}
                              />
                              <span className="dash-toggle-slider"></span>
                            </label>
                            <span>{ad.isActive ? 'Publicación Activa' : 'Publicación Pausada'}</span>
                          </div>

                          <div className="dash-ad-actions">
                            <button
                              type="button"
                              className="dash-ad-btn-edit"
                              onClick={() => handleOpenEditAd(ad)}
                              title="Editar datos de la empresa"
                            >
                              <i className="fi fi-rr-pencil"></i> Editar
                            </button>
                            <button
                              type="button"
                              className="dash-ad-btn-delete"
                              onClick={() => handleDeleteAd(ad.id, ad.title)}
                              title="Eliminar publicidad"
                            >
                              <i className="fi fi-rr-trash"></i> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB: RESERVAS ======================= */}
        {activeTab === 'reservations' && (
          <div>
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Listado de Reservas</h2>
                  <p>Administra las solicitudes de clientes, estados y contactos directos</p>
                </div>

                {/* Filtros de estado */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className={resFilter === 'ALL' ? 'dash-btn-primary' : 'dash-btn-secondary'}
                    onClick={() => setResFilter('ALL')}
                  >
                    Todas ({reservations.length})
                  </button>
                  <button
                    className={
                      resFilter === 'PENDING' ? 'dash-btn-primary' : 'dash-btn-secondary'
                    }
                    onClick={() => setResFilter('PENDING')}
                  >
                    Pendientes ({reservations.filter((r) => r.status === 'PENDING').length})
                  </button>
                  <button
                    className={
                      resFilter === 'CONFIRMED' ? 'dash-btn-primary' : 'dash-btn-secondary'
                    }
                    onClick={() => setResFilter('CONFIRMED')}
                  >
                    Confirmadas ({reservations.filter((r) => r.status === 'CONFIRMED').length})
                  </button>
                  <button
                    className={
                      resFilter === 'CANCELLED' ? 'dash-btn-primary' : 'dash-btn-secondary'
                    }
                    onClick={() => setResFilter('CANCELLED')}
                  >
                    Canceladas ({reservations.filter((r) => r.status === 'CANCELLED').length})
                  </button>
                </div>
              </div>

              {/* Buscador */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  className="dash-input"
                  placeholder="🔍 Buscar por nombre, teléfono, email, excursión o punto de encuentro..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                />
              </div>

              {/* Tabla de Reservas */}
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Excursión</th>
                      <th>Fecha</th>
                      <th>Pasajeros</th>
                      <th>Lugar de Encuentro</th>
                      <th>Pago</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                          No se encontraron reservas con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((res) => (
                        <tr key={res.id}>
                          <td>
                            <code style={{ fontSize: '11px', color: '#64748b' }}>{res.id}</code>
                          </td>
                          <td>
                            <strong>{res.passengerName}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {res.passengerPhone}
                            </div>
                            <div style={{ fontSize: '12px', color: '#0d47ff' }}>
                              {res.passengerEmail}
                            </div>
                          </td>
                          <td>
                            <strong>{res.tourTitle || res.tourId}</strong>
                          </td>
                          <td>{res.date}</td>
                          <td>{res.passengersCount} personas</td>
                          <td style={{ maxWidth: '180px', fontSize: '13px' }}>
                            {res.meetingPoint}
                          </td>
                          <td>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>
                              {res.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <select
                              className="dash-select"
                              style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                              value={res.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  res.id,
                                  e.target.value as 'PENDING' | 'CONFIRMED' | 'CANCELLED'
                                )
                              }
                            >
                              <option value="PENDING">⏳ Pendiente</option>
                              <option value="CONFIRMED">✅ Confirmada</option>
                              <option value="CANCELLED">❌ Cancelada</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <a
                                href={`https://wa.me/${res.passengerPhone.replace(
                                  /\D/g,
                                  ''
                                )}?text=${encodeURIComponent(
                                  `¡Hola ${res.passengerName}! Te contactamos de Blue Calafate sobre tu reserva para ${res.tourTitle || 'la excursión'
                                  } el día ${res.date}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dash-btn-secondary"
                                style={{ padding: '6px 10px', fontSize: '12px', background: '#25D366', color: '#fff', border: 'none' }}
                                title="Contactar por WhatsApp"
                              >
                                <i className="fi fi-brands-whatsapp"></i>
                              </a>
                              <button
                                className="dash-btn-danger"
                                style={{ padding: '6px 10px' }}
                                onClick={() => handleDeleteReservation(res.id)}
                                title="Eliminar reserva"
                              >
                                <i className="fi fi-rr-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: DISPONIBILIDAD ======================= */}
        {activeTab === 'availability' && (
          <div>
            {/* Formulario para bloquear / crear disponibilidad */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Configurar Disponibilidad o Bloquear Fecha</h2>
                  <p>Establece cupos máximos o bloquea fechas específicas para excursiones</p>
                </div>
              </div>

              <form onSubmit={handleAddAvailability}>
                <div className="dash-form-row">
                  <div className="dash-input-group">
                    <label>Excursión / Destino</label>
                    <select
                      className="dash-select"
                      value={newAvailTourId}
                      onChange={(e) => setNewAvailTourId(e.target.value)}
                      required
                    >
                      {tours.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.serviceType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="dash-input-group">
                    <label>Fecha</label>
                    <input
                      type="date"
                      className="dash-input"
                      value={newAvailDate}
                      onChange={(e) => setNewAvailDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="dash-input-group">
                    <label>Cupo Máximo de Pasajeros</label>
                    <input
                      type="number"
                      className="dash-input"
                      value={newAvailMaxSeats}
                      min={1}
                      max={50}
                      onChange={(e) => setNewAvailMaxSeats(Number(e.target.value))}
                    />
                  </div>

                  <div className="dash-input-group">
                    <label>Estado de la Fecha</label>
                    <select
                      className="dash-select"
                      value={newAvailBlocked ? 'BLOCKED' : 'AVAILABLE'}
                      onChange={(e) => setNewAvailBlocked(e.target.value === 'BLOCKED')}
                    >
                      <option value="AVAILABLE">🟢 Habilitada con cupo</option>
                      <option value="BLOCKED">🔴 Bloqueada (Sin salidas)</option>
                    </select>
                  </div>
                </div>

                <div className="dash-input-group">
                  <label>Notas / Motivo (Opcional)</label>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Ej: Mantenimiento de Sprinter, Feriado, o Cupos completos"
                    value={newAvailNotes}
                    onChange={(e) => setNewAvailNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="dash-btn-primary">
                  <i className="fi fi-rr-plus"></i> Guardar Disponibilidad
                </button>
              </form>
            </div>

            {/* Tabla de registros de disponibilidad */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Fechas Gestionadas y Bloqueos</h2>
                  <p>Listado de cupos asignados y fechas con restricciones</p>
                </div>
              </div>

              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Excursión</th>
                      <th>Fecha</th>
                      <th>Cupos Ocupados / Máximos</th>
                      <th>Estado</th>
                      <th>Notas</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilities.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                          No hay fechas configuradas manualmente. Todos los tours usan cupos estándar.
                        </td>
                      </tr>
                    ) : (
                      availabilities.map((av) => {
                        const tourObj = tours.find((t) => t.id === av.tourId || t.slug === av.tourId);
                        return (
                          <tr key={av.id}>
                            <td>
                              <strong>{tourObj ? tourObj.title : av.tourId}</strong>
                            </td>
                            <td>
                              <strong>{av.date}</strong>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>
                                  {av.reservedSeats} / {av.maxSeats}
                                </span>
                                <div
                                  style={{
                                    width: '80px',
                                    height: '8px',
                                    background: '#e2e8f0',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (av.reservedSeats / (av.maxSeats || 1)) * 100
                                      )}%`,
                                      height: '100%',
                                      background: av.isBlocked ? '#ef4444' : '#22c55e',
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`avail-pill ${av.isBlocked ? 'blocked' : 'open'}`}>
                                {av.isBlocked ? '🔴 Bloqueada' : '🟢 Habilitada'}
                              </span>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '13px' }}>
                              {av.notes || '-'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="dash-btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                  onClick={() => handleToggleBlock(av)}
                                >
                                  {av.isBlocked ? 'Desbloquear' : 'Bloquear'}
                                </button>
                                <button
                                  className="dash-btn-danger"
                                  style={{ padding: '6px 10px' }}
                                  onClick={async () => {
                                    await availabilityService.delete(av.id);
                                    showToast('Registro eliminado');
                                    loadAllData();
                                  }}
                                >
                                  <i className="fi fi-rr-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Modal para Crear Tour */}
        <CreateTourModal
          isOpen={showCreateTourModal}
          onClose={() => setShowCreateTourModal(false)}
          onTourCreated={(newTour) => {
            loadAllData();
            showToast(`✅ Tour "${newTour.title}" creado con éxito en el backend`);
          }}
        />

        {/* Modal para Crear / Editar Publicidad */}
        <CreateAdModal
          isOpen={showCreateAdModal}
          onClose={() => setShowCreateAdModal(false)}
          onAdCreated={(ad) => {
            loadAllData();
            showToast(`✅ Publicidad "${ad.title}" guardada con éxito`);
          }}
          adToEdit={adToEdit}
        />
      </main>
    </div>
  );
}

export default Dashboard;
