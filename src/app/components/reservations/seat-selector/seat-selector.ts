import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Siege } from '../../../models/siege';
import { ReservationService } from '../services/reservation';

@Component({
  selector: 'app-seat-selector',
  standalone: true, // Si usas componentes standalone en Angular moderno
  imports: [CommonModule],
  templateUrl: './seat-selector.html',
  styleUrls: ['./seat-selector.scss']
})
export class SeatSelectorComponent implements OnInit {
  @Input() seanceId!: number; // Recibe el ID de la sesión actual
  @Output() seatsSelected = new EventEmitter<Siege[]>(); // Emite los asientos elegidos al padre

  sieges: Siege[] = [];
  selectedSieges: Siege[] = [];
  seatPrice: number = 50; // Puedes ajustar el precio por asiento según tu lógica

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    if (this.seanceId) {
      this.loadSeats();
    }
  }

  // 1. Cargar los asientos desde el backend usando el servicio
  loadSeats(): void {
    this.reservationService.getSeatsBySeance(this.seanceId).subscribe({
      next: (data) => {
        this.sieges = data;
      },
      error: (err) => {
        console.error('Error al cargar los asientos:', err);
      }
    });
  }

  // 2. Manejar el clic en un asiento (seleccionar / deseleccionar)
  toggleSeat(siege: Siege): void {
    if (siege.isReserved) {
      return; // Si ya está reservado en la BD, no se puede tocar
    }

    const index = this.selectedSieges.findIndex(s => s.id === siege.id);
    if (index > -1) {
      // Si ya estaba seleccionado, lo quitamos
      this.selectedSieges.splice(index, 1);
    } else {
      // Si no estaba seleccionado, lo añadimos
      this.selectedSieges.push(siege);
    }

    // Notificamos al componente padre los asientos seleccionados actualmente
    this.seatsSelected.emit(this.selectedSieges);
  }

  // 3. Verificar si un asiento está seleccionado localmente
  isSelected(siege: Siege): boolean {
    return this.selectedSieges.some(s => s.id === siege.id);
  }

  // Calcular el total a pagar
  get totalAmount(): number {
    return this.selectedSieges.length * this.seatPrice;
  }
}