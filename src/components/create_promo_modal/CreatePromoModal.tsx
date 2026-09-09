import { useState, useEffect, useRef } from 'react';
import type { CreatePromoModalProps, Vehicle, Tour, Promotion } from '../../types';
import { promotionService, vehicleService, tourService } from '../../services';
import './CreatePromoModal.css';

const PRESET_IMAGES = [
  { file: 'promo4p.jpeg', label: 'Promo 4 Pax' },
  { file: 'portada_car.jpeg', label: 'Auto Privado' },
  { file: 'pasarelas.jpg', label: 'Glaciar Perito Moreno' },
  { file: 'fitz-roy.jpg', label: 'El Chaltén' },
  { file: 'aeropuerto.jpeg', label: 'Aeropuerto' },
  { file: 'estancias.jpeg', label: 'Estancia Patagónica' },
];

export function CreatePromoModal({
  isOpen,
  onClose,
  onPromoSaved,
  promoToEdit,
  vehicles: initialVehicles,
  tours: initialTours,
}: CreatePromoModalProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);
  const [tours, setTours] = useState<Tour[]>(initialTours || []);
  const [loadingData, setLoadingData] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [priceNumber, setPriceNumber] = useState<number>(180000);
  const [creditCardSurcharge, setCreditCardSurcharge] = useState<number>(15);
  const [creditCardPrice, setCreditCardPrice] = useState<number>(207000);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [passengersCount, setPassengersCount] = useState<number>(4);
  const [includedTourIds, setIncludedTourIds] = useState<string[]>([]);
  const [image, setImage] = useState<string>('promo4p.jpeg');
  const [showHomeModal, setShowHomeModal] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar vehículos y tours si no vinieron por props
  useEffect(() => {
    async function fetchData() {
      if ((!initialVehicles || initialVehicles.length === 0) || (!initialTours || initialTours.length === 0)) {
        setLoadingData(true);
        try {
          const [vData, tData] = await Promise.all([
            initialVehicles && initialVehicles.length > 0 ? Promise.resolve(initialVehicles) : vehicleService.getAll(),
            initialTours && initialTours.length > 0 ? Promise.resolve(initialTours) : tourService.getAll(),
          ]);
          setVehicles(vData);
          setTours(tData);
        } catch (err) {
          console.error('Error cargando vehículos o tours para el modal de promo:', err);
        } finally {
          setLoadingData(false);
        }
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, initialVehicles, initialTours]);

  // Inicializar formulario al abrir para editar o crear
  useEffect(() => {
    if (!isOpen) return;

    if (promoToEdit) {
      setTitle(promoToEdit.title || '');
      setSlug(promoToEdit.slug || '');
      setSubtitle(promoToEdit.subtitle || '');
      const basePrice = Number(promoToEdit.priceNumber) || 0;
      const surcharge = Number(promoToEdit.creditCardSurcharge ?? 15);
      setPriceNumber(basePrice);
      setCreditCardSurcharge(surcharge);
      setCreditCardPrice(Math.round(basePrice * (1 + surcharge / 100)));
      setVehicleId(promoToEdit.vehicleId || '');
      setPassengersCount(promoToEdit.passengersCount || 4);
      setIncludedTourIds(promoToEdit.includedTourIds || []);
      setImage(promoToEdit.image || 'promo4p.jpeg');
      setShowHomeModal(promoToEdit.showHomeModal ?? true);
      setIsActive(promoToEdit.isActive ?? true);
      setIsSlugManuallyEdited(true);
    } else {
      // Estado inicial para nueva promo
      setTitle('');
      setSlug('');
      setSubtitle('');
      setPriceNumber(180000);
      setCreditCardSurcharge(15);
      setCreditCardPrice(Math.round(180000 * 1.15));
      const defaultVehicle = vehicles.length > 0 ? vehicles[0] : null;
      setVehicleId(defaultVehicle ? defaultVehicle.id : 'spin');
      setPassengersCount(defaultVehicle ? defaultVehicle.capacity : 4);
      setIncludedTourIds([]);
      setImage('promo4p.jpeg');
      setShowHomeModal(true);
      setIsActive(true);
      setIsSlugManuallyEdited(false);
    }
    setErrorMsg(null);
  }, [isOpen, promoToEdit, vehicles]);

  // Si cambia la lista de vehículos y no hay vehicleId seleccionado, asignar el primero
  useEffect(() => {
    if (!vehicleId && vehicles.length > 0) {
      const first = vehicles[0];
      setVehicleId(first.id);
      setPassengersCount(first.capacity);
    }
  }, [vehicles, vehicleId]);

  if (!isOpen) return null;

  // Formateador de slug automático
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/á|à|ä/g, 'a')
      .replace(/é|è|ë/g, 'e')
      .replace(/í|ì|ï/g, 'i')
      .replace(/ó|ò|ö/g, 'o')
      .replace(/ú|ù|ü/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  // Manejar cambio de precio en efectivo
  const handleCashPriceChange = (val: number) => {
    setPriceNumber(val);
    setCreditCardPrice(Math.round(val * (1 + creditCardSurcharge / 100)));
  };

  // Manejar cambio de precio con tarjeta
  const handleCardPriceChange = (val: number) => {
    setCreditCardPrice(val);
    if (priceNumber > 0) {
      const calculatedSurcharge = Math.round(((val - priceNumber) / priceNumber) * 100);
      setCreditCardSurcharge(Math.max(0, calculatedSurcharge));
    }
  };

  // Manejar cambio de vehículo
  const handleVehicleChange = (selectedId: string) => {
    setVehicleId(selectedId);
    const selectedVeh = vehicles.find((v) => v.id === selectedId);
    if (selectedVeh) {
      setPassengersCount(selectedVeh.capacity);
    }
  };

  // Manejar selección/deselección de tour
  const handleToggleTour = (tourId: string) => {
    setIncludedTourIds((prev) => {
      if (prev.includes(tourId)) {
        return prev.filter((id) => id !== tourId);
      } else {
        return [...prev, tourId];
      }
    });
  };

  // Procesar archivo cargado por Drag & Drop o Input
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, etc.)');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Resolver src de imagen para previsualización
  const getImagePreviewSrc = (imgPath: string) => {
    if (!imgPath) return '';
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

  const selectedVehicleObj = vehicles.find((v) => v.id === vehicleId);

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('El título de la promoción es obligatorio');
      return;
    }
    if (priceNumber <= 0) {
      setErrorMsg('El precio base en efectivo debe ser mayor a 0');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    
    // Obtener nombres de los tours seleccionados para mantener compatibilidad con `includes`
    const includedTourTitles = tours
      .filter((t) => includedTourIds.includes(t.id))
      .map((t) => t.title);

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: Partial<Promotion> = {
      slug: finalSlug,
      title: title.trim(),
      subtitle: subtitle.trim(),
      badgeText: promoToEdit?.badgeText || 'PROMOCIÓN LIMITADA',
      image: image || 'promo4p.jpeg',
      priceNumber: Number(priceNumber),
      priceText: `ARS $${Number(priceNumber).toLocaleString('es-AR')}`,
      creditCardSurcharge: Number(creditCardSurcharge),
      vehicleId: vehicleId || (selectedVehicleObj ? selectedVehicleObj.id : undefined),
      passengersCount: Number(passengersCount || selectedVehicleObj?.capacity || 4),
      includedTourIds,
      includes: includedTourTitles.length > 0 ? includedTourTitles : (promoToEdit?.includes || []),
      isActive,
      showHomeModal,
      showTourLimitAlert: promoToEdit?.showTourLimitAlert ?? true,
      whatsappNumber: promoToEdit?.whatsappNumber || '5492966764900',
      whatsappText: promoToEdit?.whatsappText || `¡Hola Blue Calafate! Quiero consultar por la promoción: ${title.trim()}`,
    };

    try {
      if (promoToEdit?.id) {
        await promotionService.update(promoToEdit.id, payload);
      } else {
        await promotionService.create(payload as Omit<Promotion, 'id'>);
      }
      onPromoSaved();
      onClose();
    } catch (err: any) {
      console.error('Error guardando la promoción:', err);
      setErrorMsg(err?.response?.data?.message || err.message || 'Error al guardar la promoción en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-promo-modal-overlay" onClick={onClose}>
      <div className="create-promo-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* ==================== HEADER ==================== */}
        <div className="create-promo-modal-header">
          <div className="create-promo-header-title">
            <div className="create-promo-header-icon">
              <i className="fi fi-rr-tags"></i>
            </div>
            <div>
              <h2>{promoToEdit ? 'Editar Promoción' : 'Crear Nueva Promoción'}</h2>
              <p>Configura los datos del paquete, tarifas, vehículo y tours incluidos.</p>
            </div>
          </div>
          <button className="create-promo-close-btn" onClick={onClose} title="Cerrar modal">
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>

        {/* ==================== ERROR BANNER ==================== */}
        {errorMsg && (
          <div className="create-promo-error-banner">
            <i className="fi fi-rr-exclamation"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ==================== FORMULARIO ==================== */}
        <form onSubmit={handleSubmit} className="create-promo-modal-body">
          {/* SECCIÓN 1: DATOS PRINCIPALES */}
          <div className="create-promo-section">
            <h3 className="create-promo-section-title">
              <i className="fi fi-rr-info"></i>
              Información de la Promoción
            </h3>

            <div className="create-promo-form-grid">
              <div className="create-promo-input-group">
                <label>
                  Título de la Promoción *
                  <small>Nombre visible al cliente</small>
                </label>
                <input
                  type="text"
                  required
                  className="create-promo-input"
                  placeholder="Ej: Super Promo 4 Personas"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="create-promo-input-group">
                <label>
                  Slug o URL Amigable
                  <small>Ruta web de la promo</small>
                </label>
                <div className="create-promo-slug-wrap">
                  <span className="create-promo-slug-prefix">/promocion/</span>
                  <input
                    type="text"
                    placeholder="promo-4-personas"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setSlug(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="create-promo-input-group create-promo-field-full">
                <label>
                  Descripción de la Promoción
                  <small>Detalle o resumen del paquete promocional</small>
                </label>
                <textarea
                  className="create-promo-textarea"
                  rows={2}
                  placeholder="Ej: Paquete Completo: Aeropuerto IN/OUT + Glaciar Perito Moreno + El Chaltén Día Completo en Traslado Privado."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PRECIOS Y TARIFAS */}
          <div className="create-promo-section">
            <h3 className="create-promo-section-title">
              <i className="fi fi-rr-dollar"></i>
              Precios y Métodos de Pago
            </h3>

            <div className="create-promo-form-grid">
              <div className="create-promo-input-group">
                <label>
                  Precio en Efectivo / Transferencia ($ ARS) *
                  <small>Tarifa con descuento base</small>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  className="create-promo-input"
                  placeholder="180000"
                  value={priceNumber || ''}
                  onChange={(e) => handleCashPriceChange(Number(e.target.value))}
                />
              </div>

              <div className="create-promo-input-group">
                <label>
                  Precio para Tarjeta de Crédito ($ ARS)
                  <small>+{creditCardSurcharge}% de recargo</small>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="create-promo-input"
                  placeholder="207000"
                  value={creditCardPrice || ''}
                  onChange={(e) => handleCardPriceChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: VEHÍCULO Y CAPACIDAD */}
          <div className="create-promo-section">
            <h3 className="create-promo-section-title">
              <i className="fi fi-rr-car-alt"></i>
              Vehículo Asignado y Capacidad
            </h3>

            <div className="create-promo-input-group">
              <label>
                Seleccionar Vehículo
                <small>La capacidad de pasajeros se asigna según el vehículo</small>
              </label>
              <select
                className="create-promo-select"
                value={vehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
              >
                {vehicles.length === 0 ? (
                  <option value="">Cargando vehículos...</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — Capacidad: {v.capacity} personas (Equipaje: {v.luggageCapacity} valijas)
                    </option>
                  ))
                )}
              </select>
            </div>

            {selectedVehicleObj && (
              <div className="create-promo-vehicle-card">
                <div className="create-promo-vehicle-info">
                  <div className="create-promo-vehicle-badge-icon">
                    <i className="fi fi-rr-car-building"></i>
                  </div>
                  <div className="create-promo-vehicle-details">
                    <h4>{selectedVehicleObj.name}</h4>
                    <p>
                      Capacidad: {selectedVehicleObj.capacity} pasajeros • Equipaje: {selectedVehicleObj.luggageCapacity} valijas
                    </p>
                  </div>
                </div>
                <div className="create-promo-pax-badge">
                  <i className="fi fi-rr-users-alt"></i>
                  <span>Hasta {selectedVehicleObj.capacity} Pasajeros</span>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 4: TOURS INCLUIDOS EN LA PROMO */}
          <div className="create-promo-section">
            <div className="create-promo-tours-header">
              <h3 className="create-promo-section-title" style={{ margin: 0 }}>
                <i className="fi fi-rr-map-marker-check"></i>
                Tours Incluidos en el Paquete
              </h3>
              <span className="create-promo-tours-count">
                {includedTourIds.length} tour{includedTourIds.length !== 1 ? 's' : ''} seleccionado{includedTourIds.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loadingData && tours.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px' }}>Cargando catálogo de tours...</p>
            ) : tours.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px' }}>No hay tours disponibles en el catálogo.</p>
            ) : (
              <div className="create-promo-tours-grid">
                {tours.map((t) => {
                  const isChecked = includedTourIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`create-promo-tour-checkbox-item ${isChecked ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTour(t.id)}
                      />
                      <div className="create-promo-tour-item-info">
                        <span className="create-promo-tour-item-title">{t.title}</span>
                        <span className="create-promo-tour-item-sub">
                          {t.serviceType || 'Servicio'} • {t.departureTime || 'Horario'}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECCIÓN 5: DRAG & DROP IMAGEN */}
          <div className="create-promo-section">
            <h3 className="create-promo-section-title">
              <i className="fi fi-rr-picture"></i>
              Imagen de la Promoción (Drag & Drop)
            </h3>

            {image ? (
              <div className="create-promo-image-preview-box">
                <img
                  src={getImagePreviewSrc(image)}
                  alt="Vista previa de la promoción"
                  className="create-promo-image-preview"
                />
                <div className="create-promo-preview-overlay">
                  <button
                    type="button"
                    className="create-promo-preview-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fi fi-rr-refresh"></i> Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    className="create-promo-preview-btn danger"
                    onClick={() => setImage('')}
                  >
                    <i className="fi fi-rr-trash"></i> Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`create-promo-dropzone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="create-promo-dropzone-icon">
                  <i className="fi fi-rr-cloud-upload-alt"></i>
                </div>
                <span className="create-promo-dropzone-text">
                  Arrastra y suelta tu imagen aquí o haz clic para explorar
                </span>
                <span className="create-promo-dropzone-subtext">
                  Formatos soportados: JPG, PNG, WEBP, GIF
                </span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            {/* Plantillas / presets rápidos */}
            <div>
              <span className="create-promo-presets-title">O selecciona una imagen existente:</span>
              <div className="create-promo-presets-grid">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    type="button"
                    key={preset.file}
                    className={`create-promo-preset-pill ${image === preset.file ? 'active' : ''}`}
                    onClick={() => setImage(preset.file)}
                  >
                    <i className="fi fi-rr-image"></i>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECCIÓN 6: TOGGLES DE VISIBILIDAD */}
          <div className="create-promo-section">
            <h3 className="create-promo-section-title">
              <i className="fi fi-rr-settings-sliders"></i>
              Opciones de Publicación
            </h3>

            <div className="create-promo-toggles-grid">
              <div
                className={`create-promo-toggle-card ${showHomeModal ? 'active' : ''}`}
                onClick={() => setShowHomeModal(!showHomeModal)}
              >
                <div className="create-promo-toggle-info">
                  <h4>Modal en Inicio</h4>
                  <p>Mostrar ventana emergente al entrar al sitio</p>
                </div>
                <label
                  className="create-promo-switch"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={showHomeModal}
                    onChange={(e) => setShowHomeModal(e.target.checked)}
                  />
                  <span className="create-promo-switch-slider"></span>
                </label>
              </div>

              <div
                className={`create-promo-toggle-card ${isActive ? 'active' : ''}`}
                onClick={() => setIsActive(!isActive)}
              >
                <div className="create-promo-toggle-info">
                  <h4>Promoción Activa</h4>
                  <p>Visible y publicada en la plataforma</p>
                </div>
                <label
                  className="create-promo-switch"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className="create-promo-switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* ==================== FOOTER ==================== */}
          <div className="create-promo-modal-footer">
            <button
              type="button"
              className="create-promo-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-promo-btn-save"
              disabled={isSubmitting}
            >
              <i className="fi fi-rr-disk"></i>
              {isSubmitting
                ? 'Guardando...'
                : promoToEdit
                  ? 'Guardar Cambios'
                  : 'Crear Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePromoModal;
