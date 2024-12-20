import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../auth/services/storage.service';
import { UserControllerService, UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly USER_PROFILE_KEY = 'userProfile';

  private storageService = inject(StorageService);
  private userService = inject(UserControllerService);

  private userProfileSubject = new BehaviorSubject<UserOverviewDto | null>(this.loadUserFromStorage());
  public userProfile = signal<UserOverviewDto | null>(this.loadUserFromStorage());

  constructor() {
    this.userProfileSubject.subscribe((profile) => {
      if (profile) {
        this.storageService.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
        this.userProfile.set(profile);
      } else {
        this.storageService.removeItem(this.USER_PROFILE_KEY);
        this.userProfile.set(null);
      }
    });
  }

  refreshUserProfile(): Observable<UserOverviewDto | unknown> {
    const userId = this.userProfile()?.id;
    if (!userId) {
      throw new Error('No user id found in the user profile');
    }
    return this.userService.getUserOverviewById(userId, 'body', false, { httpHeaderAccept: 'application/json' }).pipe(
      tap((userProfile) => {
        this.updateProfile(userProfile);
      }),
      catchError((error) => {
        console.error('Failed to refresh user profile:', error);
        return error;
      })
    );
  }

  refreshAfterStateChange = <T>(operation: Observable<T>): Observable<T> => {
    return operation.pipe(
      tap({
        next: () => {
          this.refreshUserProfile().subscribe({
            next: () => console.log('Profile refresh completed'),
            error: (err) => console.error('Profile refresh failed:', err),
          });
        },
        error: (error) => {
          console.error('Operation failed:', error);
          throw error;
        },
      })
    );
  };

  updateProfile(profile: UserOverviewDto | null) {
    this.userProfileSubject.next(profile);
  }

  hasRole(role: UserOverviewDto.RoleEnum): boolean {
    return this.userProfile()?.role === role;
  }

  hasAnyRole(roles: UserOverviewDto.RoleEnum[]): boolean {
    const role = this.userProfile()?.role;
    return role ? roles.includes(role) : false;
  }

  private loadUserFromStorage() {
    const userJson = this.storageService.getItem(this.USER_PROFILE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
