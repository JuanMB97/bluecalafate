import './card_travel.css';
import usersIco from '../../assets/users_ico.png';
import maletinIco from '../../assets/maletin.png';

interface CardTravelProps {
  img: string;
  capacidad: number;
}

function CardTravel({ img, capacidad }: CardTravelProps) {
  const bgImgUrl = img.startsWith('http') || img.startsWith('/')
    ? img
    : new URL(`../../assets/${img}`, import.meta.url).href;

  return (
    <div className="box-card">
      <img className="background-card" src={bgImgUrl} alt={`Vehículo capacidad ${capacidad} personas`} />
      <div className="box-info-card">
        <div className="card-top-info">
          <div className="info-left">
            <img src={usersIco} alt="Pasajeros" />
            <p className="text-capacidad">{capacidad}</p>
          </div>

          <div className="info-right">
            <p>HASTA</p>
            <p>PERSONAS</p>
          </div>
        </div>
        <div className="card-bottom-info">
          <img src={maletinIco} alt="Equipaje" />
          <p className="max-equipaje">Hasta {capacidad} equipajes</p>
        </div>
      </div>
    </div>
  );
}

export default CardTravel;