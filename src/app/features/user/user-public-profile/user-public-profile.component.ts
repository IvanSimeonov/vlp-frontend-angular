import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseCardComponent } from '../../course/course-card/course-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  CourseControllerService,
  CourseOverviewDto,
  UserControllerService,
  UserPublicProfileDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../auth/services/storage.service';
import { UserProfileService } from '../../../services/user/user-profile.service';

@Component({
  selector: 'app-user-public-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTabsModule, MatPaginatorModule, MatCardModule, CourseCardComponent],
  templateUrl: './user-public-profile.component.html',
  styleUrl: './user-public-profile.component.scss',
})
export class UserPublicProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private userProfileService = inject(UserProfileService);
  private userService = inject(UserControllerService);
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseControllerService);

  user = signal<UserPublicProfileDto>({});
  userProfileImage = signal<Blob | string | undefined>(undefined);
  currentPageCreatedCourses = signal<CourseOverviewDto[]>([]);
  currentPageEnrolledCourses = signal<CourseOverviewDto[]>([]);
  currentPageCompletedCourses = signal<CourseOverviewDto[]>([]);

  createdCoursesPageSize = 10;
  completedCoursesPageSize = 10;
  enrolledCoursesPageSize = 10;

  ngOnInit(): void {
    let userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId === 0) {
      userId = this.userProfileService.userProfile()!.id!;
    }
    this.userService.getUserPublicProfile(userId).subscribe({
      next: (res) => {
        this.user.set(res);
        this.updateCreatedCoursesPage(0, this.createdCoursesPageSize);
        this.updateEnrolledCoursesPage(0, this.enrolledCoursesPageSize);
        this.updateCompletedCoursesPage(0, this.completedCoursesPageSize);
        const imagePath = res.profileImagePath;
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
      },
      error: (err) => {
        console.error('Error fetching user profile: ', err);
      },
    });
  }

  paginateCreatedCourses(event: PageEvent): void {
    this.createdCoursesPageSize = event.pageSize;
    this.updateEnrolledCoursesPage(event.pageIndex, event.pageSize);
  }

  paginateCompletedCourses(event: PageEvent): void {
    this.completedCoursesPageSize = event.pageSize;
    this.updateCompletedCoursesPage(event.pageIndex, event.pageSize);
  }

  paginateEnrolledCourses(event: PageEvent): void {
    this.enrolledCoursesPageSize = event.pageSize;
    this.updateCreatedCoursesPage(event.pageIndex, event.pageSize);
  }

  isUserTeacher() {
    return this.user().role === UserPublicProfileDto.RoleEnum.Teacher;
  }

  formatRole(role: UserPublicProfileDto.RoleEnum | undefined) {
    return role ? EnumUtils.formatUserRole(role) : '';
  }

  fetchCourseImage(course: CourseOverviewDto) {
    const imgPath = course.imagePath;
    if (imgPath) {
      return this.courseService.getCourseImage(imgPath);
    }
    return undefined;
  }

  private updateEnrolledCoursesPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.currentPageCreatedCourses.set(this.user().createdCourses?.slice(start, end) || []);
  }

  private updateCreatedCoursesPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.currentPageEnrolledCourses.set(this.user().enrolledCourses?.slice(start, end) || []);
  }

  private updateCompletedCoursesPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.currentPageCompletedCourses.set(this.user().completedCourses?.slice(start, end) || []);
  }
}
