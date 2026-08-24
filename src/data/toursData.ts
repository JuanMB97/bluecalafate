export interface Tour {
  id: string;
  slug: string;
  title: string;
  place: string;
  phrase: string;
  image: string;
  departureTime: string;
  returnTime: string;
  pricePerPerson: string;
  priceNumber: number;
  totalExample: string;
  logoIcon: string;
  tourCardImg: string;
  serviceType: string;
}

export const TOURS_DATA: Tour[] = [
  {
    id: 'perito-moreno',
    slug: 'perito-moreno',
    title: 'Perito Moreno',
    place: 'Perito Moreno',
    phrase: 'Traslado compartido al Glaciar Perito Moreno desde El Calafate. Cómodo, seguro y económico.',
    image: 'portada.jpg',
    departureTime: '08:00 hs',
    returnTime: '14:00 hs',
    pricePerPerson: 'ARS 35.000',
    priceNumber: 35000,
    totalExample: 'ARS 70.000',
    logoIcon: 'icon_plane.png',
    tourCardImg: 'pasarelas.jpg',
    serviceType: 'Servicio Compartido',
  },
  {
    id: 'el-chalten',
    slug: 'el-chalten',
    title: 'El Chaltén',
    place: 'El Chaltén',
    phrase: 'Traslado compartido a la capital nacional del trekking desde El Calafate. Cómodo, seguro y puntual.',
    image: 'fitz-roy.jpg',
    departureTime: '07:30 hs',
    returnTime: '18:00 hs',
    pricePerPerson: 'ARS 45.000',
    priceNumber: 45000,
    totalExample: 'ARS 90.000',
    logoIcon: 'icon_plane.png',
    tourCardImg: 'chalten-city.jpg',
    serviceType: 'Servicio Compartido',
  },
  {
    id: 'city-tour',
    slug: 'city-tour',
    title: 'City Tour',
    place: 'City Tour El Calafate',
    phrase: 'Recorrido histórico y panorámico por los mejores atractivos y miradores de El Calafate.',
    image: 'city.jfif',
    departureTime: '10:00 hs',
    returnTime: '13:00 hs',
    pricePerPerson: 'ARS 25.000',
    priceNumber: 25000,
    totalExample: 'ARS 50.000',
    logoIcon: 'icon_camera.png',
    tourCardImg: 'city.jfif',
    serviceType: 'Servicio Compartido / Privado',
  },
  {
    id: 'aeropuerto',
    slug: 'traslado-aeropuerto',
    title: 'Traslado Aeropuerto',
    place: 'Aeropuerto El Calafate',
    phrase: 'Traslados in/out desde y hacia el Aeropuerto Internacional Comandante Armando Tola (FTE).',
    image: 'aeropuerto.jpg',
    departureTime: 'Según vuelo',
    returnTime: 'Según vuelo',
    pricePerPerson: 'ARS 18.000',
    priceNumber: 18000,
    totalExample: 'ARS 36.000',
    logoIcon: 'icon_plane.png',
    tourCardImg: 'aeropuerto.jpeg',
    serviceType: 'Servicio Puerta a Puerta',
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS_DATA.find((tour) => tour.slug === slug || tour.id === slug);
}
