import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../../services/user/user-profile.service';
import { UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';

export const teacherGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);
  if (!authService.isLoggedIn() || !userProfileService.hasAnyRole([UserOverviewDto.RoleEnum.Teacher])) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
