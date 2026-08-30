import { Siege } from './siege';

export interface ReservationRequestDto {
  seanceId: number;
  customerId: number;
  nbrPlaces: number;
  siegeIds: number[];
}

export interface ReservationResponseDto {
  id: number;
  seanceId: number;
  customerId: number;
  nbrPlaces: number;
  dateReservation: string;
  sieges: Siege[];
}

export interface Reservation extends ReservationResponseDto {}