// reservation-history.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationResponseDto } from '../../../models/reservation';
import { ReservationService } from '../services/reservation';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-history.html',
  styleUrls: ['./reservation-history.scss']
})
export class ReservationHistoryComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  reservations: ReservationResponseDto[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserReservations(userId);
  }

  loadUserReservations(userId: number): void {
    this.isLoading = true;
    this.reservationService.getMyReservations(userId).subscribe({
      next: (data) => { this.reservations = data; this.isLoading = false; },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'No se pudieron cargar tus reservas.';
        this.isLoading = false;
      }
    });
  }

  cancelReservation(id: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => this.reservations = this.reservations.filter(r => r.id !== id),
      error: (err) => { console.error('Error al cancelar:', err); alert('No se pudo cancelar la reserva.'); }
    });
  }
}