import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AuthComponent } from './components/auth/auth';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MoviesComponent } from './components/movies/movies';
import { SeatSelectorComponent } from './components/reservations/seat-selector/seat-selector';
import { ReservationSummaryComponent } from './components/reservations/reservation-summary/reservation-summary';
import { ReservationHistoryComponent } from './components/reservation-history/reservation-history';
import { UpcomingFilmsComponent } from './components/movies/upcoming-films/upcoming-films';
import { GenresComponent } from './components/genres/genres/genres';
import { ProfileComponent } from './components/profile/profile';
import { SallesComponent } from './components/salles/salles';

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
      { path: 'films/a-laffiche', component: MoviesComponent },
      { path: 'films/prochainement', component: UpcomingFilmsComponent },
      { path: 'genres', component: GenresComponent },
      { path: '', pathMatch: 'full', component: MoviesComponent },
      
      {
        path: 'reservations/nouvelle',
        component: SeatSelectorComponent
      },
      {
        path: 'reservations/resumen',
        component: ReservationSummaryComponent
      },
      {
        path: 'reservations/historique',
        component: ReservationHistoryComponent
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'salles', component: SallesComponent },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];