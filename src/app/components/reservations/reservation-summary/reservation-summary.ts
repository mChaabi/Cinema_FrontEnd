import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservationRequestDto } from '../../../models/reservation';
import { ReservationService } from '../services/reservation';
import { ReservationStateService } from '../services/reservation-state';
import { AuthService } from '../../../services/auth';
import { PaiementService } from '../../../services/paiement';
import { PaiementRequestDto } from '../../../models/paiement';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-summary.html',
  styleUrls: ['./reservation-summary.scss']
})
export class ReservationSummaryComponent {
  state = inject(ReservationStateService); // público para el template
  private reservationService = inject(ReservationService);
  private paiementService = inject(PaiementService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = false;

  confirmReservation(): void {
    const sieges = this.state.selectedSieges();
    const seanceId = this.state.seanceId();
    const customerId = this.authService.currentUser()?.id;

    if (sieges.length === 0 || !seanceId || !customerId) {
      alert('Session invalide. Merci de recommencer votre réservation.');
      this.router.navigate(['/films/a-laffiche']);
      return;
    }

    const requestDto: ReservationRequestDto = {
      seanceId,
      customerId,
      nbrPlaces: sieges.length,
      siegeIds: sieges.map(s => s.id!).filter(id => id !== undefined)
    };

    this.isSubmitting = true;

    this.reservationService.createReservation(requestDto).subscribe({
      next: (reservation) => {
        // ✅ 2. Una vez creada la reserva, se registra el pago
        const paiementDto: PaiementRequestDto = {
          reservationId: reservation.id,
          amount: this.state.totalAmount(),
          status: 'PAYE'
        };

        this.paiementService.createPaiement(paiementDto).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.state.reset();
            this.router.navigate(['/reservations/historique']);
          },
          error: (err) => {
            console.error('Erreur de paiement:', err);
            this.isSubmitting = false;
            alert('La réservation a été créée mais le paiement a échoué.');
          }
        });
      },
      error: (err) => {
        console.error('Error al procesar la reserva:', err);
        this.isSubmitting = false;
        alert('Hubo un error al confirmar la reserva. Inténtalo de nuevo.');
      }
    });
  }
}