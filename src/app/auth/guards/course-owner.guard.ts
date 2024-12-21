import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { UserProfileService } from '../../services/user/user-profile.service';
import { AuthService } from '../services/auth.service';

export const courseOwnerGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);
  if (
    !authService.isLoggedIn() ||
    !userProfileService.hasAnyRole([UserOverviewDto.RoleEnum.Teacher]) ||
    !userProfileService.userProfile()?.createdCoursesIds?.includes(+route.params['id'])
  ) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
