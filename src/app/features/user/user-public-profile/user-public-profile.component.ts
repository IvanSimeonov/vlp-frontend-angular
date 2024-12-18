import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseCardComponent } from '../../course/course-card/course-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  CourseOverviewDto,
  UserControllerService,
  UserPublicProfileDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-public-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTabsModule, MatPaginatorModule, MatCardModule, CourseCardComponent],
  templateUrl: './user-public-profile.component.html',
  styleUrl: './user-public-profile.component.scss',
})
export class UserPublicProfileComponent implements OnInit {
  private userService = inject(UserControllerService);
  private route = inject(ActivatedRoute);

  user = signal<UserPublicProfileDto>({});
  userProfileImage = signal<Blob | string | undefined>(undefined);
  currentPageCreatedCourses = signal<CourseOverviewDto[]>([]);
  currentPageEnrolledCourses = signal<CourseOverviewDto[]>([]);

  createdCoursesPageSize = 10;
  enrolledCoursesPageSize = 10;

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId && !isNaN(userId)) {
      this.userService.getUserPublicProfile(userId).subscribe({
        next: (res) => {
          this.user.set(res);
          this.updateCreatedCoursesPage(0, this.createdCoursesPageSize);
          this.updateEnrolledCoursesPage(0, this.enrolledCoursesPageSize);
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
  }

  paginateCreatedCourses(event: PageEvent): void {
    this.createdCoursesPageSize = event.pageSize;
    this.updateEnrolledCoursesPage(event.pageIndex, event.pageSize);
  }

  paginateEnrolledCourses(event: PageEvent): void {
    this.enrolledCoursesPageSize = event.pageSize;
    this.updateCreatedCoursesPage(event.pageIndex, event.pageSize);
  }

  getTotalStudents() {
    return this.user().createdCourses?.reduce((total, course) => total + (course.totalStudents || 0), 0) || 0;
  }

  isUserTeacher() {
    return this.user().role === UserPublicProfileDto.RoleEnum.Teacher;
  }

  formatRole(role: UserPublicProfileDto.RoleEnum | undefined) {
    return role ? EnumUtils.formatUserRole(role) : '';
  }

  private updateEnrolledCoursesPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    console.log(end);
    // this.currentPageCreatedCourses.set(this.user().createdCourses?.slice(start, end) || []);
  }

  private updateCreatedCoursesPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    console.log(end);
    // this.currentPageEnrolledCourses.set(this.user().enrolledCourses?.slice(start, end) || []);
  }
}
