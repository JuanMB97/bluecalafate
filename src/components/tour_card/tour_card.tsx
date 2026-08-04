import './tour_card.css';

function TourCard({tourimg, logo, linkTour}: {tourimg: string, logo:string, linkTour: string}) {
  return (
    <div className='box-tour-container'>
      <img src={"/src/assets/" +  tourimg} alt="" className='tour-img' />
      <div className='tour-logo'>
        <img src={"/src/assets/" + logo} alt="" />
      </div>
      <div className='tour-info'>
        <p className='p-tour-first'>TRASLADOS</p>
        <p className='p-tour-second'>AEROPUERTO</p>
        <div className='tour-span'>
          <span>En tan solo 20 minutos!</span>
          <span>Te esperamos y te llevamos a tu destino</span>
        </div>
       
        <div className='box-tour-button'>
          <button>Ver mas</button>
          <a href={linkTour}><img src='/src/assets/icon_next.png'/></a>
        </div>

      </div>

    </div>
  )
}

export default TourCard;