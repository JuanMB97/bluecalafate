import './tour_card.css';

function TourCard({title, tourimg, logo, linkTour}: {title: string, tourimg: string, logo:string, linkTour: string}) {
  const title_array = title.split(" ");

  return (
    <div className='box-tour-container'>
      <img src={"/src/assets/" +  tourimg} alt="" className='tour-img' />
      <div className='tour-logo'>
        <img src={"/src/assets/" + logo} alt="" />
      </div>
      <div className='tour-info'>
        <p className='p-tour-first'>{title}</p>
        <p className='p-tour-second'>{title}</p>
        <div className='tour-span'>
         
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