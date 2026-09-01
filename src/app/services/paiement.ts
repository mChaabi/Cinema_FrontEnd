// src/app/services/paiement.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaiementRequestDto, PaiementResponseDto } from '../models/paiement';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/paiements';

  createPaiement(dto: PaiementRequestDto): Observable<PaiementResponseDto> {
    return this.http.post<PaiementResponseDto>(this.apiUrl, dto);
  }

  getPaiementsByReservation(reservationId: number): Observable<PaiementResponseDto> {
    return this.http.get<PaiementResponseDto>(`${this.apiUrl}/reservation/${reservationId}`);
  }
}