import './card_travel.css';

function CardTravel({img, capacidad}:{img: string, capacidad: number}){
  return(
    <div className="box-card">
      <img className="background-card" src={"/src/assets/" + img} alt="" />
      <div className="box-info-card">
        <div className="card-top-info">
          <div className='info-left'>
             <img src="/src/assets/users_ico.png" alt="" />
            <p className='text-capacidad'>{capacidad}</p>
          </div>

          <div className="info-right">
            <p>Hasta</p>
            <p>personas</p>
          </div>
        </div>
        <div className="card-bottom-info">
          <button onClick={() => alert('Hola')}>Ver Mas</button>
        </div>
      </div>
    </div>
  );
}

export default CardTravel;