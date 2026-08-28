import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Siege } from '../../../models/siege';
import { ReservationRequestDto } from '../../../models/reservation';
import { ReservationService } from '../services/reservation';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-summary.html',
  styleUrls: ['./reservation-summary.scss']
})
export class ReservationSummaryComponent implements OnInit {
  // Datos que puedes recibir por @Input o compartir mediante un servicio de estado
  @Input() seanceId!: number;
  @Input() movieTitle: string = 'Película de Ejemplo';
  @Input() selectedSieges: Siege[] = [];
  @Input() customerId: number = 1; // ID del usuario logueado actualmente

  seatPrice: number = 50; // Precio fijo por asiento (ajustable)
  isSubmitting: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Calcular el total a pagar
  get totalAmount(): number {
    return this.selectedSieges.length * this.seatPrice;
  }

  // Confirmar la reserva y enviarla al Backend (POST /api/reservations)
  confirmReservation(): void {
    if (this.selectedSieges.length === 0) return;

    const siegeIds = this.selectedSieges.map(s => s.id!).filter(id => id !== undefined);

    const requestDto: ReservationRequestDto = {
      seanceId: this.seanceId,
      customerId: this.customerId,
      nbrPlaces: this.selectedSieges.length,
      siegeIds: siegeIds
    };

    this.isSubmitting = true;

    this.reservationService.createReservation(requestDto).subscribe({
      next: (response) => {
        console.log('Reserva creada con éxito:', response);
        this.isSubmitting = false;
        // Redirigir a la vista de "Mis reservas" o mostrar un mensaje de éxito
        this.router.navigate(['/reservations/historique']);
      },
      error: (err) => {
        console.error('Error al procesar la reserva:', err);
        this.isSubmitting = false;
        alert('Hubo un error al confirmar la reserva. Inténtalo de nuevo.');
      }
    });
  }
}