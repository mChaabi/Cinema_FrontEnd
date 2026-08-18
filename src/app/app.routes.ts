import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AuthComponent } from './components/auth/auth';

export const routes: Routes = [
    {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: LayoutComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];