import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AuthComponent } from './components/auth/auth';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MoviesComponent } from './components/movies/movies';
import { SeatSelectorComponent } from './components/reservations/seat-selector/seat-selector';
import { ReservationSummaryComponent } from './components/reservations/reservation-summary/reservation-summary';
import { ReservationHistoryComponent } from './components/reservations/reservation-history/reservation-history';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Redirige la racine ('') automatiquement vers /dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // 2. Déclarer la route /dashboard
      { path: 'dashboard', component: DashboardComponent },
      { path: '', pathMatch: 'full', component: MoviesComponent },
      { path: 'films/a-laffiche', component: MoviesComponent },
      {
        path: 'reservations/nouvelle',
        component: SeatSelectorComponent
      },
      {
        path: 'reservations/historique',
        component: ReservationHistoryComponent
      },
      {
        path: 'reservations/resumen',
        component: ReservationSummaryComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];