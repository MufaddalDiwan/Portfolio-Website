import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Auth guard for future admin features
 * Currently allows all access, but provides structure for future authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // TODO: Implement actual authentication logic when admin features are added
  // For now, allow all access
  return true;

  // Future implementation might look like:
  // const authService = inject(AuthService);
  // if (authService.isAuthenticated()) {
  //   return true;
  // }
  // router.navigate(['/login']);
  // return false;
};
