// src/app/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Un USER que intenta forzar la URL /dashboard o /salles
  // es redirigido a su zona permitida
  return router.createUrlTree(['/films/a-laffiche']);
};