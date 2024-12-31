import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../auth/services/auth.service';
import { UserControllerService, UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { UserProfileService } from '../../services/user/user-profile.service';

export interface INotification {
  type: string;
  message: string;
  isRead: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserControllerService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  user = computed(() => this.userProfileService.userProfile());
  userProfileImage = signal<Blob | string | undefined>(undefined);
  notifications = signal<INotification[]>([]);
  unreadNotifications = computed(() => this.notifications().filter((n) => !n.isRead).length);

  ngOnInit(): void {
    this.fetchUserImage();
  }

  isUserLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isUserAdmin() {
    return this.userProfileService.hasAnyRole([UserOverviewDto.RoleEnum.Admin, UserOverviewDto.RoleEnum.RootAdmin]);
  }

  isUserTeacherOrStudent() {
    return this.userProfileService.hasAnyRole([UserOverviewDto.RoleEnum.Teacher, UserOverviewDto.RoleEnum.Student]);
  }

  logout() {
    this.authService.clearTokens();
    this.router.navigateByUrl('/');
  }

  fetchUserImage() {
    const imagePath = this.user()?.profileImagePath;
    if (imagePath) {
      this.userService.getProfileImage(imagePath).subscribe({
        next: (img) => {
          const imageUrl = URL.createObjectURL(img);
          this.userProfileImage.set(imageUrl);
        },
        error: (err) => {
          console.error('Error fetching profile image: ', err);
        },
      });
    }
  }

  markAllNotificationsRead() {
    // TODO: add API call
  }
}
