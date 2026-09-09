import { useState, useEffect, useRef } from 'react';
import type {
  CreateAdModalProps,
  AdCategory,
  CreateAdPayload,
  ISocialMedia,
  AdFormState,
} from '../../types';
import { advertisingService } from '../../services';
import './CreateAdModal.css';

const INITIAL_FORM: AdFormState = {
  title: '',
  category: 'comida',
  image: 'estancias.jpeg',
  location: 'El Calafate',
  slogan: '',
  linkPage: '',
  instagram: '',
  tiktok: '',
  facebook: '',
  isActive: true,
};

const CATEGORY_OPTIONS: { value: AdCategory; label: string; icon: string }[] = [
  { value: 'comida', label: 'Gastronomía / Restaurante', icon: 'fi fi-rr-utensils' },
  { value: 'bar', label: 'Bar / Cervecería', icon: 'fi fi-rr-beer' },
  { value: 'tienda_ropa', label: 'Tienda de Ropa / Montaña', icon: 'fi fi-rr-shop' },
  { value: 'excursion', label: 'Excursión / Experiencia', icon: 'fi fi-rr-hiking' },
  { value: 'otro', label: 'Otro Servicio Turístico', icon: 'fi fi-rr-star' },
];

const SUGGESTED_IMAGES = [
  { file: 'estancias.jpeg', label: 'Estancias / Rústico' },
  { file: 'city.jfif', label: 'Centro / Nocturno' },
  { file: 'fitz-roy.jpg', label: 'Montaña / Trekking' },
  { file: 'pasarelas.jpg', label: 'Glaciar / Naturaleza' },
  { file: 'portada_car_.jpg', label: 'Ruta / Paisaje' },
];

export function CreateAdModal({
  isOpen,
  onClose,
  onAdCreated,
  adToEdit,
}: CreateAdModalProps) {
  const [formData, setFormData] = useState<AdFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adToEdit) {
      let list: ISocialMedia[] = [];
      if (Array.isArray(adToEdit.socialMedia)) {
        list = adToEdit.socialMedia
          .map((s: any) =>
            typeof s === 'string'
              ? { network: 'instagram' as const, handle: s }
              : s && typeof s === 'object'
                ? { network: s.network || 'instagram', handle: typeof s.handle === 'string' ? s.handle : '' }
                : null
          )
          .filter((s): s is ISocialMedia => !!s && s.handle.trim().length > 0);
      } else if (
        typeof (adToEdit as any).socialMedia === 'string' &&
        (adToEdit as any).socialMedia.trim().startsWith('[')
      ) {
        try {
          const parsed = JSON.parse((adToEdit as any).socialMedia);
          if (Array.isArray(parsed)) {
            list = parsed
              .map((s: any) =>
                typeof s === 'string'
                  ? { network: 'instagram' as const, handle: s }
                  : s && typeof s === 'object'
                    ? { network: s.network || 'instagram', handle: typeof s.handle === 'string' ? s.handle : '' }
                    : null
              )
              .filter((s): s is ISocialMedia => !!s && s.handle.trim().length > 0);
          }
        } catch {}
      } else if ((adToEdit as any).instagram && typeof (adToEdit as any).instagram === 'string') {
        list = [{ network: 'instagram', handle: (adToEdit as any).instagram }];
      }

      const ig = list.find((s) => s.network === 'instagram')?.handle || '';
      const tt = list.find((s) => s.network === 'tiktok')?.handle || '';
      const fb = list.find((s) => s.network === 'facebook')?.handle || '';

      setFormData({
        title: adToEdit.title || '',
        category: adToEdit.category || 'comida',
        image: adToEdit.image || 'estancias.jpeg',
        location: adToEdit.location || '',
        slogan: adToEdit.slogan || '',
        linkPage: adToEdit.linkPage || '',
        instagram: ig,
        tiktok: tt,
        facebook: fb,
        isActive: adToEdit.isActive ?? true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrorMsg(null);
    setIsDragging(false);
  }, [adToEdit, isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('El archivo debe ser una imagen válida (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, image: dataUrl }));
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.slogan.trim() ||
      !formData.location.trim() ||
      !formData.image.trim()
    ) {
      setErrorMsg('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    const hasWeb = !!formData.linkPage.trim();
    const hasIg = !!formData.instagram.trim();
    const hasTt = !!formData.tiktok.trim();
    const hasFb = !!formData.facebook.trim();

    if (!hasWeb && !hasIg && !hasTt && !hasFb) {
      setErrorMsg('Debes ingresar al menos 1 canal de contacto (Página web, Instagram, TikTok o Facebook).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const socialMedia: ISocialMedia[] = [];
    if (hasIg) {
      socialMedia.push({ network: 'instagram', handle: formData.instagram.trim() });
    }
    if (hasTt) {
      socialMedia.push({ network: 'tiktok', handle: formData.tiktok.trim() });
    }
    if (hasFb) {
      socialMedia.push({ network: 'facebook', handle: formData.facebook.trim() });
    }

    const payload: CreateAdPayload = {
      title: formData.title.trim(),
      category: formData.category,
      image: formData.image.trim(),
      location: formData.location.trim(),
      slogan: formData.slogan.trim(),
      linkPage: formData.linkPage.trim(),
      socialMedia,
      isActive: formData.isActive,
    };

    try {
      if (adToEdit?.id) {
        const updated = await advertisingService.update(adToEdit.id, payload);
        if (onAdCreated) onAdCreated(updated);
      } else {
        const created = await advertisingService.create(payload);
        if (onAdCreated) onAdCreated(created);
      }
      window.dispatchEvent(new Event('ads_updated'));
      onClose();
    } catch (err: any) {
      console.error('Error guardando publicidad:', err);
      setErrorMsg(err?.message || 'Error al guardar la publicidad en el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewSrc =
    formData.image && typeof formData.image === 'string'
      ? formData.image.startsWith('http') ||
        formData.image.startsWith('data:') ||
        formData.image.startsWith('blob:') ||
        formData.image.startsWith('/')
        ? formData.image
        : new URL(`../../assets/${formData.image}`, import.meta.url).href
      : '';

  return (
    <div className="create-ad-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="create-ad-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="create-ad-modal-header">
          <div className="create-ad-header-title">
            <div className="create-ad-header-icon">
              <i className="fi fi-rr-bullhorn"></i>
            </div>
            <div>
              <h2>{adToEdit ? 'Editar Publicidad' : 'Nueva Publicidad de Empresa'}</h2>
              <p>Configura el faldón publicitario horizontal y sus enlaces directos</p>
            </div>
          </div>
          <button type="button" className="create-ad-close-btn" onClick={onClose} aria-label="Cerrar modal">
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>

        {errorMsg && (
          <div className="create-ad-error-banner">
            <i className="fi fi-rr-info"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-ad-form">
          <div className="create-ad-form-body">
            {/* Fila: Título y Categoría */}
            <div className="create-ad-form-row">
              <div className="create-ad-field">
                <label htmlFor="ad-title">
                  Título / Nombre de la Empresa <span className="req">*</span>
                </label>
                <div className="create-ad-input-wrap">
                  <i className="fi fi-rr-shop"></i>
                  <input
                    id="ad-title"
                    type="text"
                    required
                    placeholder="Ej: La Tablita Parrilla, Apart Oliva..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="create-ad-field">
                <label htmlFor="ad-category">
                  Categoría del Comercio <span className="req">*</span>
                </label>
                <div className="create-ad-input-wrap">
                  <i className="fi fi-rr-apps"></i>
                  <select
                    id="ad-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as AdCategory })
                    }
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fila: Slogan y Ubicación */}
            <div className="create-ad-form-row">
              <div className="create-ad-field">
                <label htmlFor="ad-slogan">
                  Slogan / Frase del Banner <span className="req">*</span>
                </label>
                <div className="create-ad-input-wrap">
                  <i className="fi fi-rr-quote-right"></i>
                  <input
                    id="ad-slogan"
                    type="text"
                    required
                    placeholder="Ej: El auténtico cordero patagónico al asador tradicional."
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="create-ad-field">
                <label htmlFor="ad-location">
                  Dirección en la Ciudad <span className="req">*</span>
                </label>
                <div className="create-ad-input-wrap">
                  <i className="fi fi-rr-marker"></i>
                  <input
                    id="ad-location"
                    type="text"
                    required
                    placeholder="Ej: Cnel. Rosales 28, El Calafate"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Sección: Canales de Redirección (Web y Redes Sociales) */}
            <div className="create-ad-channels-section">
              <div className="create-ad-channels-header">
                <div className="channels-title-row">
                  <i className="fi fi-rr-share"></i>
                  <strong>Canales de Contacto y Redirección</strong>
                  <span className="channels-badge-min">Mínimo 1 requerido *</span>
                </div>
                <p>
                  Ingresa los perfiles o sitio web a los que podrán acceder los visitantes al hacer clic en sus respectivos iconos.
                </p>
              </div>

              <div className="create-ad-channels-grid">
                {/* Página Web */}
                <div className="create-ad-field">
                  <label htmlFor="ad-link-page">
                    <i className="fi fi-rr-globe channel-icon-web"></i>
                    Página Web Oficial
                  </label>
                  <div className="create-ad-input-wrap">
                    <i className="fi fi-rr-link-alt"></i>
                    <input
                      id="ad-link-page"
                      type="text"
                      placeholder="https://www.tuempresa.com"
                      value={formData.linkPage}
                      onChange={(e) => setFormData({ ...formData, linkPage: e.target.value })}
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="create-ad-field">
                  <label htmlFor="ad-instagram">
                    <i className="fi fi-brands-instagram channel-icon-ig"></i>
                    Instagram
                  </label>
                  <div className="create-ad-input-wrap">
                    <i className="fi fi-brands-instagram" style={{ color: '#e1306c' }}></i>
                    <input
                      id="ad-instagram"
                      type="text"
                      placeholder="@usuario o https://instagram.com/..."
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                </div>

                {/* TikTok */}
                <div className="create-ad-field">
                  <label htmlFor="ad-tiktok">
                    <i className="fi fi-brands-tik-tok channel-icon-tt"></i>
                    TikTok
                  </label>
                  <div className="create-ad-input-wrap">
                    <i className="fi fi-brands-tik-tok" style={{ color: '#000000' }}></i>
                    <input
                      id="ad-tiktok"
                      type="text"
                      placeholder="@usuario o https://tiktok.com/@..."
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="create-ad-field">
                  <label htmlFor="ad-facebook">
                    <i className="fi fi-brands-facebook channel-icon-fb"></i>
                    Facebook
                  </label>
                  <div className="create-ad-input-wrap">
                    <i className="fi fi-brands-facebook" style={{ color: '#1877f2' }}></i>
                    <input
                      id="ad-facebook"
                      type="text"
                      placeholder="usuario o https://facebook.com/..."
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Drag & Drop para Imagen de Faldón Publicitario */}
            <div className="create-ad-field">
              <label>
                Imagen de Fondo del Banner (Faldón Publicitario) <span className="req">*</span>
              </label>

              {/* Mensaje de dimensiones recomendadas */}
              <div className="create-ad-banner-notice">
                <div className="ad-notice-icon">
                  <i className="fi fi-rr-picture"></i>
                </div>
                <div className="ad-notice-text">
                  <strong>Formato Horizontal Recomendado (Faldón Publicitario)</strong>
                  <p>
                    La imagen ocupará la <strong>totalidad del fondo del banner</strong>.
                    Dimensiones recomendadas: <strong>1200 × 300 px</strong> (proporción 4:1) o <strong>970 × 250 px</strong> (mínimo 800 × 200 px).
                    Formatos admitidos: <strong>PNG, JPG, WEBP</strong>.
                  </p>
                </div>
              </div>

              {/* Input de archivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              {/* Dropzone Interactiva */}
              <div
                className={`create-ad-dropzone ${isDragging ? 'drag-over' : ''} ${formData.image ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                title="Haz clic o arrastra una imagen horizontal aquí"
              >
                {formData.image && previewSrc ? (
                  <div className="create-ad-dropzone-preview">
                    <img src={previewSrc} alt="Vista previa del faldón" className="create-ad-dropzone-img" />
                    <div className="create-ad-dropzone-overlay">
                      <i className="fi fi-rr-refresh"></i>
                      <span>Cambiar imagen horizontal (Arrastra otra o haz clic)</span>
                    </div>
                  </div>
                ) : (
                  <div className="create-ad-dropzone-empty">
                    <i className="fi fi-rr-cloud-upload create-ad-dropzone-icon"></i>
                    <strong>Arrastra tu imagen horizontal aquí</strong>
                    <span>o haz clic para explorar en tu dispositivo</span>
                  </div>
                )}
              </div>

              {/* Entrada manual de URL/Archivo y Sugerencias */}
              <div className="create-ad-img-manual-row">
                <div className="create-ad-input-wrap create-ad-input-wrap-sm">
                  <i className="fi fi-rr-link-alt"></i>
                  <input
                    type="text"
                    placeholder="O ingresa el nombre de asset o URL de la imagen..."
                    value={
                      formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:')
                        ? 'Imagen cargada desde archivo local'
                        : formData.image || ''
                    }
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              {/* Sugerencias Rápidas de Imágenes */}
              <div className="create-ad-img-pills">
                <span className="create-ad-img-pills-label">Assets sugeridos:</span>
                {SUGGESTED_IMAGES.map((sug) => (
                  <button
                    type="button"
                    key={sug.file}
                    className={`create-ad-img-pill ${formData.image === sug.file ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, image: sug.file })}
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibilidad Activa */}
            <div className="create-ad-visibility-card">
              <label className="create-ad-toggle-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className="create-ad-toggle-box"></span>
                <div className="create-ad-visibility-info">
                  <strong>Visibilidad Activa</strong>
                  <p>
                    {formData.isActive
                      ? 'La publicidad está habilitada y se mostrará en los faldones publicitarios de la web.'
                      : 'La publicidad está pausada y oculta temporalmente.'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="create-ad-modal-footer">
            <button
              type="button"
              className="create-ad-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-ad-btn-submit"
              disabled={isSubmitting}
            >
              <i className={`fi ${isSubmitting ? 'fi-rr-spinner create-ad-spin' : 'fi-rr-disk'}`}></i>
              <span>
                {isSubmitting
                  ? 'Guardando...'
                  : adToEdit
                    ? 'Guardar Cambios'
                    : 'Crear Publicidad'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAdModal;
