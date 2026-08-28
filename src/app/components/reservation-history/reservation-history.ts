import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../services/reservation';
@Component({
 selector: 'app-reservation-history',
 standalone: true,
 imports: [CommonModule, RouterModule],
 templateUrl: './reservation-history.html',
 styleUrl: './reservation-history.scss'
})
export class ReservationHistoryComponent implements OnInit {
 reservations: any[] = [];
 isLoading: boolean = true;
 errorMessage: string = '';
 constructor(
   private reservationService: ReservationService,
   private cdr: ChangeDetectorRef
 ) {}
 ngOnInit(): void {
   this.chargerHistorique();
 }
 chargerHistorique() {
   const customerId = 1;
   this.reservationService.getHistoriqueByUser(customerId).subscribe({
     next: (data) => {
       this.reservations = data;
       this.isLoading = false;
       this.cdr.detectChanges();
     },
     error: (err) => {
       this.errorMessage = "Impossible de charger vos billets pour le moment.";
       this.isLoading = false;
       this.cdr.detectChanges(); 
     }
   });
 }
}