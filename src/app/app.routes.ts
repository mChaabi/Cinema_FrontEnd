import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];