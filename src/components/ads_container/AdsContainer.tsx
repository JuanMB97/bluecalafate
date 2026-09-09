import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { advertisingService } from '../../services';
import type { Advertising, AdsContainerProps } from '../../types';
import { AdBanner } from '../ad_card/ad_banner';
import './AdsContainer.css';

export const AdsContainer: React.FC<AdsContainerProps> = ({
  ads: initialAds,
  title,
  subtitle,
  badge,
  className = '',
}) => {
  const { t } = useTranslation();
  const [ads, setAds] = useState<Advertising[]>(initialAds || []);
  const [loading, setLoading] = useState<boolean>(!initialAds);

  useEffect(() => {
    if (initialAds) {
      setAds(initialAds.filter((a: Advertising) => a.isActive !== false));
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadActiveAds() {
      try {
        const data = await advertisingService.getActive();
        if (isMounted) {
          setAds(data.filter((a) => a.isActive !== false));
        }
      } catch (err) {
        console.error('Error al cargar publicidades activas:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadActiveAds();

    // Sincronización en tiempo real con cambios realizados desde el Dashboard
    const handleAdsUpdated = async () => {
      try {
        const data = await advertisingService.getActive();
        if (isMounted) {
          setAds(data.filter((a) => a.isActive !== false));
        }
      } catch (err) {
        console.error('Error al actualizar publicidades activas:', err);
      }
    };

    window.addEventListener('ads_updated', handleAdsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('ads_updated', handleAdsUpdated);
    };
  }, [initialAds]);

  // Si no hay publicidades activas o está cargando inicialmente, no mostrar nada para evitar espacios vacíos
  if (loading || !ads || ads.length === 0) {
    return null;
  }

  const sectionBadge = badge || t('ads.badge', 'ESPACIO PUBLICITARIO RECOMENDADO');
  const sectionTitle = title || t('ads.title', 'Recomendaciones en El Calafate');
  const sectionSubtitle =
    subtitle ||
    t(
      'ads.subtitle',
      'Conocé las mejores propuestas gastronómicas, comercios y experiencias en El Calafate y la región.'
    );

  return (
    <section className={`ads-container-section ${className}`}>
      <div className="ads-container-header">
        <div className="ads-section-badge">
          <i className="fi fi-rr-bullhorn"></i>
          <span>{sectionBadge}</span>
        </div>
        <h2 className="ads-section-title">{sectionTitle}</h2>
        <p className="ads-section-subtitle">{sectionSubtitle}</p>
      </div>

      <div className="ads-faldones-list">
        {ads.map((ad) => (
          <AdBanner key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  );
};

export default AdsContainer;
