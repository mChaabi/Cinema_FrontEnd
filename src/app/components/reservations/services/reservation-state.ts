// src/app/reservations/services/reservation-state.ts
import { Injectable, signal, computed } from '@angular/core';
import { Siege } from '../../../models/siege';

@Injectable({ providedIn: 'root' })
export class ReservationStateService {
  readonly seanceId = signal<number | null>(null);
  readonly movieTitle = signal<string>('');
  readonly selectedSieges = signal<Siege[]>([]);
  readonly seatPrice = signal<number>(50);

  readonly totalAmount = computed(() =>
    this.selectedSieges().length * this.seatPrice()
  );

  setSeance(seanceId: number, movieTitle: string): void {
    this.seanceId.set(seanceId);
    this.movieTitle.set(movieTitle);
    this.selectedSieges.set([]); // reset al cambiar de sesión
  }

  setSelectedSieges(sieges: Siege[]): void {
    this.selectedSieges.set(sieges);
  }

  reset(): void {
    this.seanceId.set(null);
    this.movieTitle.set('');
    this.selectedSieges.set([]);
  }
}