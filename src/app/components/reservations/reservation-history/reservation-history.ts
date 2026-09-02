import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationResponseDto } from '../../../models/reservation';
import { ReservationService } from '../services/reservation';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

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
  private cdr = inject(ChangeDetectorRef); // 👈 Inyectamos detector de cambios para forzar el redibujado

  reservations: any[] = [];
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
      next: (data: any) => {
        console.log('Datos de reservas obtenidos:', data);
        
        try {
          const raw = Array.isArray(data) ? data : (data?.content ?? []);

          this.reservations = raw.map((r: any) => ({
            id: r.id ?? 0,
            filmTitre: r.filmTitre ?? 'Película sin título',
            filmPhotoUrl: r.filmPhotoUrl ?? '',
            salleNumero: r.salleNumero ?? 1,
            dateProjection: r.dateProjection ?? '',
            heureDebut: r.heureDebut ?? '',
            siegesNumeros: Array.isArray(r.siegesNumeros) ? r.siegesNumeros : [],
            statutPaiement: r.statutPaiement ?? 'PAYE',
            montantPaye: r.montantPaye ?? 0
          }));
        } catch (e) {
          console.error('Error mapeando reservas:', e);
        } finally {
          this.isLoading = false;
          this.cdr.detectChanges(); // 👈 Forzamos a Angular a actualizar la pantalla inmediatamente
        }
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'No se pudieron cargar tus reservas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelReservation(id: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error al cancelar:', err); 
        alert('No se pudo cancelar la reserva.'); 
      }
    });
  }
}