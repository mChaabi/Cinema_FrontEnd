import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation';
import { Reservation } from '../../models/reservation';
@Component({
 selector: 'app-reservation-add',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './reservation-add.html',
 styleUrls: ['./reservation-add.scss']
})
export class ReservationAddComponent implements OnInit {
 nouvelleReservation: Reservation = {
   seanceId: 0,
   customerId: 1,
   nbrPlaces: 1
 };
 messageResultat: string = '';
 isSuccess: boolean = false;
 constructor(private reservationService: ReservationService) {}
 ngOnInit(): void {}
  validerReservation() {
   this.reservationService.createReservation(this.nouvelleReservation).subscribe({
     next: (res) => {
       this.messageResultat = 'Billet réservé avec succès !';
       this.isSuccess = true; 
     },
     error: (err) => {
       this.messageResultat = 'Erreur de connexion avec le serveur.';
       this.isSuccess = false; 
     }
   });
 }
}