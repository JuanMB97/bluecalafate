import React from 'react';
import type { AdBannerProps, AdCategory, CategoryConfig, ISocialMedia } from '../../types';
import './ad_banner.css';

const CATEGORY_MAP: Record<AdCategory, CategoryConfig> = {
  comida: { label: 'Gastronomía', icon: 'fi fi-rr-utensils' },
  bar: { label: 'Bar & Cervecería', icon: 'fi fi-rr-beer' },
  tienda_ropa: { label: 'Tienda & Ropa', icon: 'fi fi-rr-shop' },
  excursion: { label: 'Excursión & Aventura', icon: 'fi fi-rr-hiking' },
  otro: { label: 'Servicio Destacado', icon: 'fi fi-rr-star' },
};

function getWebUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getSocialUrl(network: 'instagram' | 'tiktok' | 'facebook', handle?: string): string {
  if (!handle || typeof handle !== 'string') return '#';
  const trimmed = handle.trim();
  if (!trimmed) return '#';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@/, '');
  switch (network) {
    case 'instagram':
      return `https://instagram.com/${clean}`;
    case 'tiktok':
      return `https://tiktok.com/@${clean}`;
    case 'facebook':
      return `https://facebook.com/${clean}`;
    default:
      return '#';
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, className = '' }) => {
  if (!ad) return null;

  // Resuelve la URL de la imagen (asset local, URL remota o base64)
  const adImgUrl =
    ad.image &&
    typeof ad.image === 'string' &&
    (ad.image.startsWith('http') ||
      ad.image.startsWith('/') ||
      ad.image.startsWith('data:') ||
      ad.image.startsWith('blob:'))
      ? ad.image
      : new URL(`../../assets/${ad?.image || 'estancias.jpeg'}`, import.meta.url).href;

  const categoryInfo = (ad.category && CATEGORY_MAP[ad.category as AdCategory]) || CATEGORY_MAP.otro;

  // Lista de redes sociales (con soporte retrocompatible)
  let socialList: ISocialMedia[] = [];
  if (Array.isArray(ad.socialMedia)) {
    socialList = ad.socialMedia
      .map((s: any) =>
        typeof s === 'string'
          ? { network: 'instagram' as const, handle: s }
          : s && typeof s === 'object'
            ? { network: s.network || 'instagram', handle: typeof s.handle === 'string' ? s.handle : '' }
            : null
      )
      .filter((s): s is ISocialMedia => !!s && s.handle.trim().length > 0);
  } else if (typeof (ad as any).socialMedia === 'string' && (ad as any).socialMedia.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse((ad as any).socialMedia);
      if (Array.isArray(parsed)) {
        socialList = parsed
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
  } else if ((ad as any).instagram && typeof (ad as any).instagram === 'string') {
    socialList = [{ network: 'instagram' as const, handle: (ad as any).instagram }];
  }

  const hasWebsite = typeof ad.linkPage === 'string' && ad.linkPage.trim().length > 0;

  return (
    <div
      className={`ad-faldon-banner ${className}`}
      aria-label={`Faldón publicitario: ${ad.title}`}
    >
      {/* Imagen completa de fondo del faldón */}
      <img
        src={adImgUrl}
        alt={ad.title}
        className="ad-faldon-bg-image"
        loading="lazy"
      />

      {/* Overlay sutil para legibilidad del contenido publicitario */}
      <div className="ad-faldon-overlay" />

      {/* Encabezado superior del faldón: Etiqueta de publicidad e insignia */}
      <div className="ad-faldon-top-bar">
        <span className="ad-faldon-tag-ad">
          <i className="fi fi-rr-bullhorn"></i> Publicidad
        </span>

        <span className="ad-faldon-badge-category">
          <i className={categoryInfo.icon}></i>
          <span>{categoryInfo.label}</span>
        </span>
      </div>

      {/* Contenido flotante del faldón */}
      <div className="ad-faldon-body">
        <div className="ad-faldon-info">
          {ad.location && (
            <span className="ad-faldon-location">
              <i className="fi fi-rr-marker"></i> {ad.location}
            </span>
          )}
          <h3 className="ad-faldon-title">{ad.title}</h3>
          {ad.slogan && <p className="ad-faldon-slogan">{ad.slogan}</p>}
        </div>

        {/* Canales de contacto / Redirección (solo iconos con enlace directo) */}
        <div className="ad-faldon-action">
          <span className="ad-faldon-action-label">Seguinos</span>
          <div className="ad-faldon-social-group">
            {/* Página web oficial */}
            {hasWebsite && (
              <a
                href={getWebUrl(ad.linkPage!)}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-social-icon-btn web"
                title={`Visitar web oficial de ${ad.title}`}
                aria-label={`Web de ${ad.title}`}
              >
                <i className="fi fi-rr-globe"></i>
              </a>
            )}

            {/* Redes Sociales */}
            {socialList.map((item, idx) => {
              let iconClass = 'fi fi-rr-share';
              let titleText = `${item.network} de ${ad.title}`;

              if (item.network === 'instagram') {
                iconClass = 'fi fi-brands-instagram';
                titleText = `Instagram de ${ad.title}`;
              } else if (item.network === 'tiktok') {
                iconClass = 'fi fi-brands-tik-tok';
                titleText = `TikTok de ${ad.title}`;
              } else if (item.network === 'facebook') {
                iconClass = 'fi fi-brands-facebook';
                titleText = `Facebook de ${ad.title}`;
              }

              return (
                <a
                  key={`${item.network}-${idx}`}
                  href={getSocialUrl(item.network, item.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ad-social-icon-btn ${item.network}`}
                  title={titleText}
                  aria-label={titleText}
                >
                  <i className={iconClass}></i>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;

