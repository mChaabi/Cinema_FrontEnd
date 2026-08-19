import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AuthComponent } from './components/auth/auth';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MoviesComponent } from './components/movies/movies';
import { ReservationAddComponent } from './components/reservation-add/reservation-add';
import { ReservationHistoryComponent } from './components/reservation-history/reservation-history';
export const routes: Routes = [
 {
   path: 'login',
   component: AuthComponent
 },
 {
   path: '',
   component: LayoutComponent,
   children: [
     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
     { path: 'dashboard', component: DashboardComponent },
     { path: 'films/a-laffiche', component: MoviesComponent },
     // Les routes dyal les réservations 
     { path: 'reservations/nouvelle', component: ReservationAddComponent },
     { path: 'reservations/historique', component: ReservationHistoryComponent }
   ]
 },
 {
   path: '**',
   redirectTo: ''
 }
];