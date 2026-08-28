import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationRequestDto, ReservationResponseDto } from '../../../models/reservation';
import { Siege } from '../../../models/siege';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';
  private seanceUrl = 'http://localhost:8080/api/seances';

  constructor(private http: HttpClient) {}

  // 1. Obtener los asientos de una sesión específica
  getSeatsBySeance(seanceId: number): Observable<Siege[]> {
    return this.http.get<Siege[]>(`${this.seanceUrl}/${seanceId}/sieges`);
  }

  // 2. Crear una nueva reserva (POST /api/reservations)
  createReservation(dto: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.post<ReservationResponseDto>(this.apiUrl, dto);
  }

  // 3. Obtener las reservas de un usuario (GET /api/reservations/user/{userId})
  getMyReservations(userId: number): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 4. Cancelar / eliminar una reserva (DELETE /api/reservations/{id})
  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}