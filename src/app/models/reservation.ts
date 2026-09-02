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
  // Añade estas propiedades que faltaban:
  filmPhotoUrl?: string;
  filmTitre?: string;
  salleNumero?: string | number;
  dateProjection?: string;
  heureDebut?: string;
  siegesNumeros?: string[];
  statutPaiement?: string;
  montantPaye?: number;
}

export interface Reservation extends ReservationResponseDto {}