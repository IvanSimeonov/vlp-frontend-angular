import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (
    !authService.isLoggedIn() ||
    !authService.hasAnyRole([UserOverviewDto.RoleEnum.RootAdmin, UserOverviewDto.RoleEnum.Admin])
  ) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
