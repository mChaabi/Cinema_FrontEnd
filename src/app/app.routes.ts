import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { adminGuard } from './guards/admin-guard';
import { SallesComponent } from './components/salles/salles';
import { GenresComponent } from './components/genres/genres/genres';
import { MoviesComponent } from './components/movies/movies';
import { UpcomingFilmsComponent } from './components/movies/upcoming-films/upcoming-films';
import { SeatSelectorComponent } from './components/reservations/seat-selector/seat-selector';
import { ReservationSummaryComponent } from './components/reservations/reservation-summary/reservation-summary';
import { ProfileComponent } from './components/profile/profile';
import { ReservationHistoryComponent } from './components/reservations/reservation-history/reservation-history';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],   // 🔒 Exige estar logueado
    children: [
      { path: '', redirectTo: 'films/a-laffiche', pathMatch: 'full' },

      // 👑 Solo ADMIN (Gestión protegida + Perfil de administrador)
      { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
      { path: 'salles',    component: SallesComponent,    canActivate: [adminGuard] },
      { path: 'genres',    component: GenresComponent,    canActivate: [adminGuard] },
      { path: 'profile',   component: ProfileComponent,   canActivate: [adminGuard] }, // 🔒 ¡Solo el ADMIN puede ver su perfil aquí!

      // 👤 ADMIN + USER (Disponibles para todos los logueados)
      { path: 'films/a-laffiche',         component: MoviesComponent },
      { path: 'films/prochainement',     component: UpcomingFilmsComponent },
      { path: 'reservations/nouvelle/:seanceId', component: SeatSelectorComponent },
      { path: 'reservations/resumen',    component: ReservationSummaryComponent },
      { path: 'reservations/historique', component: ReservationHistoryComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];