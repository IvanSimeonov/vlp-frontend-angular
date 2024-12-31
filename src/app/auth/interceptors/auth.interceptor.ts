import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user/user-profile.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  private readonly WHITE_LISTED_URLS = ['/api/v1/courses'];

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAccessToken();
    const isWhiteListed = this.WHITE_LISTED_URLS.some((url) => request.url === url);
    if (authToken && !isWhiteListed) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`),
      });
    }
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse && !isWhiteListed) {
            if (
              (event.url?.includes('api/v1/courses/learnings') ||
                event.url?.includes('profile') ||
                event.url?.includes('edit-profile')) &&
              this.authService.isLoggedIn()
            ) {
              this.userProfileService.refreshUserProfile().subscribe({
                next: () => console.log('Profile refresh completed'),
                error: (error) => {
                  console.error('Failed to refresh user profile:', error);
                },
              });
            }
          }
        },
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.clearTokens();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
