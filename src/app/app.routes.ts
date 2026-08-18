import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AuthComponent } from './components/auth/auth';
import { DashboardComponent } from './components/dashboard/dashboard';

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
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];