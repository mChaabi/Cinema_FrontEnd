<<<<<<< HEAD
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

// Mantén esta por compatibilidad si la usas en otro lado
export interface Reservation extends ReservationResponseDto {}
=======
export interface Reservation {
 id?: number;           
 seanceId: number;       
 customerId: number;     
 nbrPlaces: number;      
 dateReservation?: Date; 
}
>>>>>>> 77661a1a115acfb9e0a1066ab0788037ac99f60e
