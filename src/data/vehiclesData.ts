export interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: number;
  luggageCapacity: number;
}

export const VEHICLES_DATA: Vehicle[] = [
  {
    id: 'spin',
    name: 'Chevrolet Spin',
    image: 'spin_car.png',
    capacity: 4,
    luggageCapacity: 4,
  },
  {
    id: 'expert',
    name: 'Peugeot Expert',
    image: 'expert_car.webp',
    capacity: 6,
    luggageCapacity: 6,
  },
  {
    id: 'h1',
    name: 'Hyundai H1',
    image: 'h1_car.png',
    capacity: 11,
    luggageCapacity: 11,
  },
  {
    id: 'sprinter-9',
    name: 'Mercedes Sprinter 9+1',
    image: 'sprinter9plus1.png',
    capacity: 9,
    luggageCapacity: 9,
  },
  {
    id: 'sprinter-19',
    name: 'Mercedes Sprinter 19+1',
    image: 'sprinter19plus1.png',
    capacity: 19,
    luggageCapacity: 19,
  },
];
