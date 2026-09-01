import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Siege } from '../../../models/siege';
import { ReservationService } from '../services/reservation';
import { ReservationStateService } from '../services/reservation-state';

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
  state = inject(ReservationStateService); // público para el template

  sieges: Siege[] = [];

  ngOnInit(): void {
    // ✅ el seanceId viene de la URL, no de un @Input roto
    const seanceId = Number(this.route.snapshot.paramMap.get('seanceId'));
    if (!seanceId) {
      this.router.navigate(['/films/a-laffiche']);
      return;
    }
    this.state.seanceId.set(seanceId);
    this.loadSeats(seanceId);
  }

  loadSeats(seanceId: number): void {
    this.reservationService.getSeatsBySeance(seanceId).subscribe({
      next: (data) => (this.sieges = data),
      error: (err) => console.error('Error al cargar los asientos:', err)
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