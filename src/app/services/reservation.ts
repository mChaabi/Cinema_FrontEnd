import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
@Injectable({
 providedIn: 'root'
})
export class ReservationService {
 private apiUrl = 'http://localhost:8080/api/reservations';
 constructor(private http: HttpClient) { }

 createReservation(reservation: Reservation): Observable<Reservation> {
   return this.http.post<Reservation>(this.apiUrl, reservation);
 }

 getReservationsByUser(userId: number): Observable<Reservation[]> {
   return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
 }
  getHistoriqueByUser(customerId: number): Observable<any[]> {
   return this.http.get<any[]>(`${this.apiUrl}/user/${customerId}`);
 }
}