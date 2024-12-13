import { inject, Injectable, signal } from '@angular/core';
import {
  AuthControllerService,
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  UserOverviewDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { StorageService } from './storage.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_PROFILE_KEY = 'userProfile';

  private authBeService = inject(AuthControllerService);
  private storageService = inject(StorageService);
  public user = signal<UserOverviewDto | null>(this.loadUserFromStorage());

  login(credentials: AuthRequest) {
    return this.authBeService.login(credentials).pipe(
      tap({
        next: (response: AuthResponse) => {
          this.storageService.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
          this.storageService.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          if (response.userOverviewDto) {
            this.storageService.setItem(this.USER_PROFILE_KEY, JSON.stringify(response.userOverviewDto));
            this.user.set(response.userOverviewDto);
          }
        },
        error: (err) => {
          console.error('Login failed: ', err);
        },
      })
    );
  }

  register(registerData: RegisterRequest) {
    return this.authBeService.register(registerData).pipe(
      tap({
        next: (response: AuthResponse) => {
          this.storageService.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
          this.storageService.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
        },
        error: (err) => {
          console.error('Register failed: ', err);
        },
      })
    );
  }

  getAccessToken(): string | null {
    return this.storageService.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storageService.getItem(this.REFRESH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  hasRole(role: UserOverviewDto.RoleEnum): boolean {
    return this.user()?.role === role;
  }

  hasAnyRole(roles: UserOverviewDto.RoleEnum[]): boolean {
    const role = this.user()?.role;
    return role ? roles.includes(role) : false;
  }

  clearTokens(): void {
    this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
    this.storageService.removeItem(this.REFRESH_TOKEN_KEY);
    this.storageService.removeItem(this.USER_PROFILE_KEY);
    this.user.set(null);
  }

  private loadUserFromStorage() {
    const userJson = this.storageService.getItem(this.USER_PROFILE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
