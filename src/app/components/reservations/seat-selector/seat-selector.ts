// seat-selector.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Siege } from '../../../models/siege';
import { ReservationService } from '../services/reservation';
import { ReservationStateService } from '../services/reservation-state';
import { SeanceService } from '../../../services/seance';

@Component({
  selector: 'app-seat-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selector.html',
  styleUrls: ['./seat-selector.scss']
})
export class SeatSelectorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private seanceService = inject(SeanceService);
  state = inject(ReservationStateService); // público para el template

  sieges = signal<Siege[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    const seanceId = Number(this.route.snapshot.paramMap.get('seanceId'));
    if (!seanceId) {
      this.router.navigate(['/films/a-laffiche']);
      return;
    }

    this.seanceService.getSeanceById(seanceId).subscribe({
      next: (seance) => {
        // ✅ Ahora sí se guarda el título, aunque entres por URL directa
        this.state.setSeance(seance.id!, seance.filmTitre);
        this.loadSeats(seance.id!);
      },
      error: () => this.router.navigate(['/films/a-laffiche'])
    });
  }

  loadSeats(seanceId: number): void {
    this.isLoading.set(true);
    this.reservationService.getSeatsBySeance(seanceId).subscribe({
      next: (data) => {
        this.sieges.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los asientos:', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleSeat(siege: Siege): void {
    if (siege.isReserved) return;

    const current = this.state.selectedSieges();
    const index = current.findIndex(s => s.id === siege.id);

    const updated = index > -1
      ? current.filter(s => s.id !== siege.id)
      : [...current, siege];

    this.state.setSelectedSieges(updated);
  }

  isSelected(siege: Siege): boolean {
    return this.state.selectedSieges().some(s => s.id === siege.id);
  }

  goToSummary(): void {
    this.router.navigate(['/reservations/resumen']);
  }
}