import { Link } from 'react-router';
import './tour_card.css';
import iconNext from '../../assets/icon_next.png';

interface TourCardProps {
  title: string;
  tourimg: string;
  logo?: string;
  linkTour: string;
  description?: string;
}

function TourCard({
  title,
  tourimg,
  logo = 'icon_plane.png',
  linkTour,
  description = 'Te esperamos y te llevamos a tu destino',
}: TourCardProps) {
  const tourImgUrl = tourimg.startsWith('http') || tourimg.startsWith('/')
    ? tourimg
    : new URL(`../../assets/${tourimg}`, import.meta.url).href;

  const logoUrl = logo.startsWith('http') || logo.startsWith('/')
    ? logo
    : new URL(`../../assets/${logo}`, import.meta.url).href;

  return (
    <div className="box-tour-container">
      <img src={tourImgUrl} alt={title} className="tour-img" />

      <div className="tour-logo">
        <img src={logoUrl} alt="" />
      </div>

      <div className="tour-info">
        <p className="p-tour-first">{title}</p>
        <p className="p-tour-second">{title}</p>

        <div className="tour-span">
          <span>{description}</span>
        </div>

        <div className="box-tour-button">
          <Link to={linkTour} className="btn-tour-link">
            <span>Ver más</span>
            <img src={iconNext} alt="Ir al tour" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TourCard;