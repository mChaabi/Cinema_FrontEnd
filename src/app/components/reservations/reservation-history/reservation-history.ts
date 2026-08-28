import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationResponseDto } from '../../../models/reservation';
import { ReservationService } from '../services/reservation';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-history.html',
  styleUrls: ['./reservation-history.scss']
})
export class ReservationHistoryComponent implements OnInit {
  reservations: ReservationResponseDto[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // ID de ejemplo del usuario actual (puedes cambiarlo por el de tu sesión activa)
  currentUserId: number = 1; 

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadUserReservations();
  }

  loadUserReservations(): void {
    this.isLoading = true;
    this.reservationService.getMyReservations(this.currentUserId).subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'No se pudieron cargar tus reservas.';
        this.isLoading = false;
      }
    });
  }

  // Opcional: Cancelar una reserva desde el historial
  cancelReservation(id: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          // Filtramos la lista localmente para quitar la cancelada
          this.reservations = this.reservations.filter(r => r.id !== id);
        },
        error: (err) => {
          console.error('Error al cancelar:', err);
          alert('No se pudo cancelar la reserva.');
        }
      });
    }
  }
}