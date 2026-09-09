import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { promotionService } from '../../services';
import type { Promotion, PromoCardsContainerProps } from '../../types';
import './PromoCardsContainer.css';

export function PromoCardsContainer({
  promos: initialPromos,
  title = 'Promociones Especiales y Paquetes Combinados',
  subtitle = 'Aprovechá traslados privados exclusivos y excursiones combinadas con tarifas preferenciales.',
}: PromoCardsContainerProps) {
  const [promos, setPromos] = useState<Promotion[]>(initialPromos || []);
  const [loading, setLoading] = useState(!initialPromos);

  useEffect(() => {
    if (initialPromos) {
      setPromos(initialPromos.filter((p) => p.isActive));
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadPromos() {
      try {
        const data = await promotionService.getActive();
        if (isMounted) {
          setPromos(data);
        }
      } catch (err) {
        console.error('Error cargando promociones activas:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPromos();

    const handlePromoUpdate = async () => {
      try {
        const data = await promotionService.getActive();
        if (isMounted) setPromos(data);
      } catch (err) {
        console.error('Error actualizando promociones:', err);
      }
    };

    window.addEventListener('promo_settings_updated', handlePromoUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('promo_settings_updated', handlePromoUpdate);
    };
  }, [initialPromos]);

  if (loading) {
    return null;
  }

  if (!promos || promos.length === 0) {
    return null;
  }

  return (
    <section className="promo-cards-section">
      <div className="promo-cards-header">
        <div className="promo-section-badge">
          <span className="promo-pulse-dot"></span>
          <span>¡OFERTAS POR TIEMPO LIMITADO!</span>
        </div>
        <h2 className="promo-section-title">{title}</h2>
        <p className="promo-section-subtitle">{subtitle}</p>
      </div>

      <div className="promo-grid">
        {promos.map((promo) => {
          const imgUrl =
            promo?.image && typeof promo.image === 'string' && (promo.image.startsWith('http') || promo.image.startsWith('/'))
              ? promo.image
              : promo?.image && typeof promo.image === 'string'
                ? new URL(`../../assets/${promo.image}`, import.meta.url).href
                : '';

          const baseFormatted = promo.priceText || `ARS $${promo.priceNumber.toLocaleString('es-AR')}`;
          const cardPrice = Math.round(promo.priceNumber * (1 + promo.creditCardSurcharge / 100));
          const cardFormatted = `ARS $${cardPrice.toLocaleString('es-AR')}`;

          return (
            <div key={promo.id} className="promo-card-item">
              <div className="promo-card-image-wrap">
                <img src={imgUrl} alt={promo.title} className="promo-card-img" />
                <div className="promo-card-badge-tag">
                  <i className="fi fi-rr-flame"></i>
                  <span>{promo.badgeText || 'PROMO EXCLUSIVA'}</span>
                </div>
              </div>

              <div className="promo-card-content">
                <div className="promo-card-capacity-pill">
                  <i className="fi fi-rr-users-alt"></i>
                  <span>Hasta {promo.passengersCount} Pasajeros</span>
                </div>

                <h3 className="promo-card-title">{promo.title}</h3>
                <p className="promo-card-description">{promo.subtitle}</p>

                {promo.includes && promo.includes.length > 0 && (
                  <ul className="promo-card-includes">
                    {promo.includes.map((item, idx) => (
                      <li key={idx}>
                        <i className="fi fi-rr-check-circle"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="promo-card-pricing-box">
                  <div className="promo-price-main">
                    <span className="promo-price-label">Precio Total Promo:</span>
                    <strong className="promo-price-value">{baseFormatted}</strong>
                    <span className="promo-price-sublabel">Efectivo / Transferencia</span>
                  </div>

                  {promo.creditCardSurcharge > 0 && (
                    <div className="promo-price-card-note">
                      <i className="fi fi-rr-credit-card"></i>
                      <span>Con tarjeta: <strong>{cardFormatted}</strong> (+{promo.creditCardSurcharge}%)</span>
                    </div>
                  )}
                </div>

                <div className="promo-card-footer">
                  <Link
                    to={`/promocion/${promo.slug || promo.id}`}
                    className="promo-card-btn"
                    title={`Ver detalles de ${promo.title}`}
                  >
                    <span>Ver Promoción y Reservar</span>
                    <i className="fi fi-bs-arrow-circle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PromoCardsContainer;
