import { useState, useRef } from 'react';
import type {
  CreateTourModalProps,
  CreateTourFormData,
  CreateTourPayload,
} from '../../types';
import { tourService } from '../../services';
import { TourCard } from '../tour_card/tour_card';
import './CreateTourModal.css';

const INITIAL_FORM: CreateTourFormData = {
  title: '',
  slug: '',
  place: '',
  phrase: '',
  image: 'portada.jpg', // Portada (Obligatoria)
  tourCardImg: 'pasarelas.jpg', // Miniatura TourCard (Obligatoria)
  galleryImages: ['pasarelas.jpg', 'portada.jpg'], // Galería de imágenes (Opcional)
  logoIcon: 'fi fi-sr-snowflakes',
  serviceType: 'Servicio Compartido',
  departureTime: '09:00 hs',
  returnTime: '17:00 hs',
  priceNumber: 35000,
  pricePerPerson: 'ARS $35.000',
  totalExample: 'ARS $70.000',
  hasPrivateOption: true,
  privatePriceNumber: 65000,
  privatePricePerPerson: 'ARS $65.000',
  privateTotalExample: 'ARS $130.000',
  privatePhrase: 'Traslado privado exclusivo con vehículo y chofer a disposición, eligiendo tu horario de salida y regreso',
  sharedDepartureTimes: '08:00 hs, 14:00 hs',
  sharedReturnTimes: '14:00 hs, 19:30 hs',
};

const POPULAR_ICONS = [
  { icon: 'fi fi-sr-snowflakes', label: 'Glaciar / Hielo' },
  { icon: 'fi fi-sr-mountain', label: 'Montaña / Trek' },
  { icon: 'fi fi-sr-bus-alt', label: 'Traslado / Bus' },
  { icon: 'fi fi-sr-plane-departure', label: 'Aeropuerto' },
  { icon: 'fi fi-sr-compass', label: 'Aventura' },
  { icon: 'fi fi-sr-water', label: 'Navegación / Lago' },
];

const POPULAR_TEMPLATES = [
  { cover: 'portada.jpg', card: 'pasarelas.jpg', label: 'Glaciar Perito Moreno' },
  { cover: 'fitz-roy.jpg', card: 'chalten-city.jpg', label: 'El Chaltén' },
  { cover: 'portada_apto.PNG', card: 'aeropuerto.jpeg', label: 'Traslado Aeropuerto' },
  { cover: 'estancias.jpeg', card: 'estancias.jpeg', label: 'Estancias Patagónicas' },
  { cover: 'city.jfif', card: 'city.jfif', label: 'City Tour Calafate' },
];

const SERVICE_TYPES = [
  'Servicio Compartido',
  'Servicio Puerta a Puerta',
  'Servicio Regular',
  'Servicio Privado Exclusivo',
];

export function CreateTourModal({ isOpen, onClose, onTourCreated }: CreateTourModalProps) {
  const [formData, setFormData] = useState<CreateTourFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSlugAuto, setIsSlugAuto] = useState(true);

  // Drag & Drop visual states
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Hidden file input refs
  const cardInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (isSlugAuto) {
      setFormData((prev) => ({
        ...prev,
        title,
        slug: slugify(title),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugAuto(false);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      priceNumber: num,
      pricePerPerson: `ARS $${num.toLocaleString('es-AR')}`,
      totalExample: `ARS $${(num * 2).toLocaleString('es-AR')}`,
    }));
  };

  const handlePrivatePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      privatePriceNumber: num,
      privatePricePerPerson: `ARS $${num.toLocaleString('es-AR')}`,
      privateTotalExample: `ARS $${(num * 2).toLocaleString('es-AR')}`,
    }));
  };

  // Helper to convert file to Base64 or object URL for instant live preview
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  // 1. Drag & Drop for Miniatura TourCard (Mandatory)
  const handleCardFile = async (file: File) => {
    const dataUrl = await processImageFile(file);
    setFormData((prev) => ({ ...prev, tourCardImg: dataUrl }));
  };

  const handleCardDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingCard(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCardFile(e.dataTransfer.files[0]);
    }
  };

  // 2. Drag & Drop for Portada (Mandatory)
  const handleCoverFile = async (file: File) => {
    const dataUrl = await processImageFile(file);
    setFormData((prev) => ({ ...prev, image: dataUrl }));
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingCover(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCoverFile(e.dataTransfer.files[0]);
    }
  };

  // 3. Drag & Drop for Gallery Array (Optional)
  const handleGalleryFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUrls: string[] = [];
    for (const f of fileArray) {
      const url = await processImageFile(f);
      newUrls.push(url);
    }
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...newUrls],
    }));
  };

  const handleGalleryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleGalleryFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Por favor, ingresa el título del tour.');
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMessage('Por favor, especifica un slug válido.');
      return;
    }
    if (!formData.place.trim()) {
      setErrorMessage('Por favor, especifica el lugar o destino del tour.');
      return;
    }
    if (!formData.tourCardImg.trim()) {
      setErrorMessage('La imagen en miniatura para TourCard es obligatoria.');
      return;
    }
    if (!formData.image.trim()) {
      setErrorMessage('La imagen de portada para el tour es obligatoria.');
      return;
    }
    if (formData.priceNumber <= 0) {
      setErrorMessage('El precio por persona debe ser mayor a 0.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateTourPayload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        place: formData.place.trim(),
        phrase: formData.phrase.trim(),
        image: formData.image.trim(),
        tourCardImg: formData.tourCardImg.trim(),
        galleryImages: formData.galleryImages,
        logoIcon: formData.logoIcon.trim(),
        serviceType: formData.serviceType.trim(),
        departureTime: formData.departureTime.trim(),
        returnTime: formData.returnTime.trim(),
        priceNumber: formData.priceNumber,
        pricePerPerson: formData.pricePerPerson.trim(),
        totalExample: formData.totalExample.trim(),
        hasPrivateOption: formData.hasPrivateOption,
      };

      if (formData.hasPrivateOption) {
        payload.privatePriceNumber = formData.privatePriceNumber;
        payload.privatePricePerPerson = formData.privatePricePerPerson.trim();
        payload.privateTotalExample = formData.privateTotalExample.trim();
        payload.privatePhrase = formData.privatePhrase.trim();
      }

      if (formData.sharedDepartureTimes?.trim()) {
        payload.sharedDepartureTimes = formData.sharedDepartureTimes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      if (formData.sharedReturnTimes?.trim()) {
        payload.sharedReturnTimes = formData.sharedReturnTimes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const createdTour = await tourService.create(payload);
      setFormData(INITIAL_FORM);
      setIsSlugAuto(true);
      onTourCreated(createdTour);
      onClose();
    } catch (err: unknown) {
      console.error('Error al crear tour:', err);
      const msg = err instanceof Error ? err.message : 'Error desconocido al guardar en backend';
      setErrorMessage(`No se pudo crear el tour: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tour-modal-backdrop" onClick={onClose}>
      <div className="tour-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tour-modal-header">
          <div className="tour-modal-header-info">
            <div className="tour-modal-header-icon">
              <i className="fi fi-rr-map-marker-plus"></i>
            </div>
            <div>
              <h2>Agregar Nuevo Tour</h2>
              <p>Completa la información y recursos visuales para publicar un nuevo tour en Blue Calafate</p>
            </div>
          </div>
          <button className="tour-modal-close-btn" onClick={onClose} title="Cerrar modal">
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="tour-modal-body">
          {errorMessage && (
            <div className="tour-modal-error">
              <i className="fi fi-rr-exclamation"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Información Principal */}
          <div className="tour-form-section">
            <h3 className="tour-section-title">
              <i className="fi fi-rr-info"></i> 1. Información Principal
            </h3>

            <div className="tour-grid-2">
              <div className="tour-field-group">
                <label>
                  Título del Tour *
                  <span className="tour-hint">Nombre comercial visible</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  placeholder="Ej: Glaciar Perito Moreno Tradicional"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Slug (URL amigable) *
                  <span className="tour-hint">/tours/{formData.slug || 'mi-tour'}</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  placeholder="ej: glaciar-perito-moreno"
                  value={formData.slug}
                  onChange={handleSlugChange}
                />
              </div>
            </div>

            <div className="tour-grid-2">
              <div className="tour-field-group">
                <label>
                  Lugar / Destino *
                  <span className="tour-hint">Ubicación geográfica</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  placeholder="Ej: Parque Nacional Los Glaciares"
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Tipo de Servicio *
                  <span className="tour-hint">Modalidad de transporte</span>
                </label>
                <select
                  className="tour-select"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tour-field-group">
              <label>
                Frase Descriptiva / Lema *
                <span className="tour-hint">Breve síntesis para portadas y tarjetas</span>
              </label>
              <textarea
                required
                className="tour-textarea"
                rows={2}
                placeholder="Ej: Conoce el gigante de hielo milenario con pasarelas panorámicas y navegación opcional."
                value={formData.phrase}
                onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
              />
            </div>
          </div>

          {/* 2. Horarios y Frecuencias */}
          <div className="tour-form-section">
            <h3 className="tour-section-title">
              <i className="fi fi-rr-clock"></i> 2. Horarios y Salidas
            </h3>

            <div className="tour-grid-2">
              <div className="tour-field-group">
                <label>
                  Horario de Salida Principal *
                  <span className="tour-hint">Inicio del recorrido</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  placeholder="Ej: 09:00 hs"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Horario de Regreso Estimado *
                  <span className="tour-hint">Llegada al hotel</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  placeholder="Ej: 17:00 hs"
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                />
              </div>
            </div>

            <div className="tour-grid-2">
              <div className="tour-field-group">
                <label>
                  Salidas Compartidas (Opcional)
                  <span className="tour-hint">Separadas por coma</span>
                </label>
                <input
                  type="text"
                  className="tour-input"
                  placeholder="Ej: 09:00 hs, 13:00 hs"
                  value={formData.sharedDepartureTimes}
                  onChange={(e) =>
                    setFormData({ ...formData, sharedDepartureTimes: e.target.value })
                  }
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Regresos Compartidos (Opcional)
                  <span className="tour-hint">Separadas por coma</span>
                </label>
                <input
                  type="text"
                  className="tour-input"
                  placeholder="Ej: 14:00 hs, 18:00 hs"
                  value={formData.sharedReturnTimes}
                  onChange={(e) =>
                    setFormData({ ...formData, sharedReturnTimes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 3. Tarifas y Precios */}
          <div className="tour-form-section">
            <h3 className="tour-section-title">
              <i className="fi fi-rr-dollar"></i> 3. Tarifas Estándar
            </h3>

            <div className="tour-grid-3">
              <div className="tour-field-group">
                <label>
                  Precio Numérico (ARS) *
                  <span className="tour-hint">Valor por persona</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  className="tour-input"
                  placeholder="35000"
                  value={formData.priceNumber}
                  onChange={handlePriceChange}
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Precio por Persona (Visual)
                  <span className="tour-hint">Autocalculado</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  value={formData.pricePerPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerPerson: e.target.value })
                  }
                />
              </div>

              <div className="tour-field-group">
                <label>
                  Ejemplo Total (2 Pasajeros)
                  <span className="tour-hint">Autocalculado</span>
                </label>
                <input
                  type="text"
                  required
                  className="tour-input"
                  value={formData.totalExample}
                  onChange={(e) => setFormData({ ...formData, totalExample: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 4. Imágenes con Drag & Drop e Icono */}
          <div className="tour-form-section">
            <h3 className="tour-section-title">
              <i className="fi fi-rr-picture"></i> 4. Recursos Visuales e Imágenes (Drag & Drop)
            </h3>

            {/* Template helpers */}
            <div className="tour-quick-pills">
              <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>
                Plantillas rápidas:
              </span>
              {POPULAR_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  className={`tour-pill-btn ${
                    formData.image === tmpl.cover && formData.tourCardImg === tmpl.card ? 'active' : ''
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      image: tmpl.cover,
                      tourCardImg: tmpl.card,
                      galleryImages: [tmpl.card, tmpl.cover],
                    })
                  }
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Grid de Dropzones obligatorias */}
            <div className="tour-grid-2" style={{ marginTop: '10px' }}>
              {/* Dropzone 1: Miniatura TourCard (OBLIGATORIA) */}
              <div className="tour-field-group">
                <label>
                  <span>
                    Miniatura de Tarjeta (TourCard) *
                    <span className="tour-badge-required">Obligatoria</span>
                  </span>
                  <span className="tour-hint">Vista en la grilla de tours</span>
                </label>

                <div
                  className={`tour-dropzone ${isDraggingCard ? 'drag-over' : ''} ${
                    formData.tourCardImg ? 'has-image' : ''
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingCard(true);
                  }}
                  onDragLeave={() => setIsDraggingCard(false)}
                  onDrop={handleCardDrop}
                  onClick={() => cardInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={cardInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCardFile(e.target.files[0]);
                      }
                    }}
                  />

                  {formData.tourCardImg ? (
                    <div className="tour-dropzone-preview">
                      <img
                        src={
                          formData.tourCardImg.startsWith('http') ||
                          formData.tourCardImg.startsWith('data:') ||
                          formData.tourCardImg.startsWith('blob:') ||
                          formData.tourCardImg.startsWith('/')
                            ? formData.tourCardImg
                            : new URL(`../../assets/${formData.tourCardImg}`, import.meta.url).href
                        }
                        alt="Miniatura Preview"
                        className="tour-dropzone-img"
                      />
                      <div className="tour-dropzone-overlay">
                        <i className="fi fi-rr-cloud-upload"></i>
                        <span>Arrastrá o hacé clic para cambiar miniatura</span>
                      </div>
                    </div>
                  ) : (
                    <div className="tour-dropzone-empty">
                      <i className="fi fi-rr-cloud-upload tour-dropzone-icon"></i>
                      <strong>Arrastrá aquí la imagen miniatura</strong>
                      <span>o hacé clic para explorar tus archivos</span>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  required
                  className="tour-input"
                  style={{ marginTop: '6px', fontSize: '12px' }}
                  placeholder="Nombre de archivo o URL (ej: pasarelas.jpg)"
                  value={formData.tourCardImg.startsWith('data:') ? 'Imagen cargada localmente' : formData.tourCardImg}
                  onChange={(e) => setFormData({ ...formData, tourCardImg: e.target.value })}
                />
              </div>

              {/* Dropzone 2: Portada del Tour (OBLIGATORIA) */}
              <div className="tour-field-group">
                <label>
                  <span>
                    Portada de Encabezado (Tour Banner) *
                    <span className="tour-badge-required">Obligatoria</span>
                  </span>
                  <span className="tour-hint">Fondo hero en la vista del tour</span>
                </label>

                <div
                  className={`tour-dropzone ${isDraggingCover ? 'drag-over' : ''} ${
                    formData.image ? 'has-image' : ''
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingCover(true);
                  }}
                  onDragLeave={() => setIsDraggingCover(false)}
                  onDrop={handleCoverDrop}
                  onClick={() => coverInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCoverFile(e.target.files[0]);
                      }
                    }}
                  />

                  {formData.image ? (
                    <div className="tour-dropzone-preview">
                      <img
                        src={
                          formData.image.startsWith('http') ||
                          formData.image.startsWith('data:') ||
                          formData.image.startsWith('blob:') ||
                          formData.image.startsWith('/')
                            ? formData.image
                            : new URL(`../../assets/${formData.image}`, import.meta.url).href
                        }
                        alt="Portada Preview"
                        className="tour-dropzone-img"
                      />
                      <div className="tour-dropzone-overlay">
                        <i className="fi fi-rr-cloud-upload"></i>
                        <span>Arrastrá o hacé clic para cambiar portada</span>
                      </div>
                    </div>
                  ) : (
                    <div className="tour-dropzone-empty">
                      <i className="fi fi-rr-cloud-upload tour-dropzone-icon"></i>
                      <strong>Arrastrá aquí la imagen de portada</strong>
                      <span>o hacé clic para explorar tus archivos</span>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  required
                  className="tour-input"
                  style={{ marginTop: '6px', fontSize: '12px' }}
                  placeholder="Nombre de archivo o URL (ej: portada.jpg)"
                  value={formData.image.startsWith('data:') ? 'Imagen cargada localmente' : formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>

            {/* Dropzone 3: Galería de Imágenes Asociadas (OPCIONAL) */}
            <div className="tour-field-group" style={{ marginTop: '16px' }}>
              <label>
                <span>
                  Galería de Imágenes Asociadas
                  <span className="tour-badge-optional">Opcional</span>
                </span>
                <span className="tour-hint">Para el futuro visor de fotos del tour</span>
              </label>

              <div
                className={`tour-dropzone tour-gallery-dropzone ${isDraggingGallery ? 'drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingGallery(true);
                }}
                onDragLeave={() => setIsDraggingGallery(false)}
                onDrop={handleGalleryDrop}
                onClick={() => galleryInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={galleryInputRef}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleGalleryFiles(e.target.files);
                    }
                  }}
                />

                <div className="tour-dropzone-empty">
                  <i className="fi fi-rr-pictures tour-dropzone-icon"></i>
                  <strong>Arrastrá una o varias fotos para la galería</strong>
                  <span>Hacé clic para seleccionar múltiples imágenes</span>
                </div>
              </div>

              {/* Grid de previews de la galería */}
              {formData.galleryImages.length > 0 && (
                <div className="tour-gallery-preview-grid">
                  {formData.galleryImages.map((imgSrc, index) => {
                    const previewUrl =
                      imgSrc.startsWith('http') ||
                      imgSrc.startsWith('data:') ||
                      imgSrc.startsWith('blob:') ||
                      imgSrc.startsWith('/')
                        ? imgSrc
                        : new URL(`../../assets/${imgSrc}`, import.meta.url).href;

                    return (
                      <div key={index} className="tour-gallery-item">
                        <img src={previewUrl} alt={`Foto ${index + 1}`} />
                        <button
                          type="button"
                          className="tour-gallery-remove-btn"
                          title="Eliminar foto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveGalleryImage(index);
                          }}
                        >
                          <i className="fi fi-rr-cross-small"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ícono descriptivo */}
            <div className="tour-field-group" style={{ marginTop: '12px' }}>
              <label>
                Clase de Icono (Flaticon) *
                <span className="tour-hint">Icono representativo</span>
              </label>
              <input
                type="text"
                required
                className="tour-input"
                placeholder="Ej: fi fi-sr-snowflakes"
                value={formData.logoIcon}
                onChange={(e) => setFormData({ ...formData, logoIcon: e.target.value })}
              />

              <div className="tour-quick-pills">
                {POPULAR_ICONS.map((ic) => (
                  <button
                    type="button"
                    key={ic.icon}
                    className={`tour-pill-btn ${formData.logoIcon === ic.icon ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, logoIcon: ic.icon })}
                  >
                    <i className={ic.icon}></i> {ic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Modalidad Privada VIP */}
          <div className="tour-form-section">
            <h3 className="tour-section-title">
              <i className="fi fi-rr-star"></i> 5. Modalidad Privada VIP (Opcional)
            </h3>

            <div
              className="tour-vip-toggle-wrap"
              onClick={() =>
                setFormData({ ...formData, hasPrivateOption: !formData.hasPrivateOption })
              }
            >
              <div className="tour-vip-info">
                <strong>Habilitar Opción de Servicio Privado VIP</strong>
                <span>
                  Tanto el servicio compartido como el privado son hasta 4 personas (diferenciados por el horario fijo vs. a elección). Para +4 pax se consulta cotización.
                </span>
              </div>
              <label className="tour-switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={formData.hasPrivateOption}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPrivateOption: e.target.checked })
                  }
                />
                <span className="tour-slider"></span>
              </label>
            </div>

            {formData.hasPrivateOption && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                <div className="tour-grid-3">
                  <div className="tour-field-group">
                    <label>Precio Privado Numérico (ARS)</label>
                    <input
                      type="number"
                      min={0}
                      className="tour-input"
                      value={formData.privatePriceNumber}
                      onChange={handlePrivatePriceChange}
                    />
                  </div>

                  <div className="tour-field-group">
                    <label>Precio Privado Visual</label>
                    <input
                      type="text"
                      className="tour-input"
                      value={formData.privatePricePerPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, privatePricePerPerson: e.target.value })
                      }
                    />
                  </div>

                  <div className="tour-field-group">
                    <label>Ejemplo Total Privado (2 pax)</label>
                    <input
                      type="text"
                      className="tour-input"
                      value={formData.privateTotalExample}
                      onChange={(e) =>
                        setFormData({ ...formData, privateTotalExample: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="tour-field-group">
                  <label>Frase de la Opción Privada</label>
                  <input
                    type="text"
                    className="tour-input"
                    placeholder="Ej: Vehículo exclusivo con chofer y guía dedicado para tu grupo familiar"
                    value={formData.privatePhrase}
                    onChange={(e) =>
                      setFormData({ ...formData, privatePhrase: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Vista Previa en Vivo mediante el componente TourCard */}
          <div className="tour-modal-live-preview-section">
            <div className="tour-live-preview-header">
              <h3 className="tour-section-title">
                <i className="fi fi-rr-eye"></i> Vista Previa en Vivo de la Tarjeta (TourCard)
              </h3>
              <span className="tour-live-preview-badge">Renderizado Real</span>
            </div>
            <p className="tour-hint" style={{ margin: '4px 0 16px 0' }}>
              Así se verá en tiempo real la tarjeta en la página principal y en la sección de servicios:
            </p>

            <div className="tour-preview-card-wrapper">
              <TourCard
                id="preview-modal"
                title={formData.title || 'Título del Nuevo Tour'}
                slug={formData.slug || 'slug-del-tour'}
                place={formData.place || 'Destino / Ubicación'}
                phrase={formData.phrase || 'Frase descriptiva del tour para los viajeros.'}
                image={formData.image}
                tourCardImg={formData.tourCardImg}
                galleryImages={formData.galleryImages}
                logoIcon={formData.logoIcon || 'fi fi-sr-snowflakes'}
                serviceType={formData.serviceType || 'Servicio Compartido'}
                departureTime={formData.departureTime || '09:00 hs'}
                returnTime={formData.returnTime || '17:00 hs'}
                pricePerPerson={formData.pricePerPerson || 'ARS $35.000'}
                priceNumber={formData.priceNumber}
                totalExample={formData.totalExample}
                hasPrivateOption={formData.hasPrivateOption}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="tour-modal-footer">
          <button
            type="button"
            className="tour-btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="tour-btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="tour-spinner"></div>
                <span>Creando en Backend...</span>
              </>
            ) : (
              <>
                <i className="fi fi-rr-disk"></i>
                <span>Crear Tour</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
