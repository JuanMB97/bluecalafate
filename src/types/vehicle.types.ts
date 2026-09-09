export interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: number;
  luggageCapacity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleCarouselProps {
  vehicles?: Vehicle[];
  title?: string;
  subtitle?: string;
}

export interface CardTravelProps {
  img: string;
  capacidad: number;
  name?: string;
  luggageCapacity?: number;
  description?: string;
}
