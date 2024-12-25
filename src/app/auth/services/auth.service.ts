import { inject, Injectable } from '@angular/core';
import {
  AuthControllerService,
  AuthRequest,
  AuthResponse,
  RegisterRequest,
} from '@ivannicksim/vlp-backend-openapi-client';
import { StorageService } from './storage.service';
import { tap } from 'rxjs';
import { UserProfileService } from '../../services/user/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private authBeService = inject(AuthControllerService);
  private storageService = inject(StorageService);
  private userProfileService = inject(UserProfileService);

  login(credentials: AuthRequest) {
    return this.authBeService.login(credentials).pipe(
      tap({
        next: (response: AuthResponse) => {
          this.storageService.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
          this.storageService.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          if (response.userOverviewDto) {
            this.userProfileService.updateProfile(response.userOverviewDto);
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
          console.log('Register response data: ', response);
        },
        error: (err) => {
          console.error('Registration failed: ', err);
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

  clearTokens(): void {
    this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
    this.storageService.removeItem(this.REFRESH_TOKEN_KEY);
    this.userProfileService.updateProfile(null);
  }
}
