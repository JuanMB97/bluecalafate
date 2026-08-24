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
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: number;
  luggageCapacity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationDto {
  tourId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  date: string;
  passengersCount: number;
  meetingPoint: string;
  paymentMethod: string;
}

export interface ReservationResponse {
  id: string;
  status: string;
  createdAt: string;
  message?: string;
  reservation?: {
    id: string;
    tourId: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    date: string;
    passengersCount: number;
    meetingPoint: string;
    paymentMethod: string;
    status: string;
  };
}
