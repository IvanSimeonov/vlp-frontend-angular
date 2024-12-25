import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseCardComponent } from '../../features/course/course-card/course-card.component';
import { Router } from '@angular/router';
import {
  CourseControllerService,
  CourseOverviewDto,
  TeacherOverviewDto,
  UserControllerService,
} from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, CourseCardComponent],
})
export class HomepageComponent implements OnInit {
  private router = inject(Router);
  private courseService = inject(CourseControllerService);
  private userService = inject(UserControllerService);

  courses = signal<CourseOverviewDto[]>([]);
  teachers = signal<TeacherOverviewDto[]>([]);
  teacherImages = new Map<number, string>();

  currentIndex = 0;
  slideDirection = 0;
  maxIndex = computed(() => {
    const totalCourses = this.courses().length;
    return Math.max(0, totalCourses - 4);
  });

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchTeachers();
  }

  fetchCourses() {
    this.courseService.getTopCoursesByStudentCount().subscribe({
      next: (res) => {
        this.courses.set(res);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  fetchTeachers() {
    this.userService.getTopTeachersByStudentCount().subscribe({
      next: (res) => {
        this.teachers.set(res);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  fetchUserImage(user: TeacherOverviewDto): string {
    const userId = user.id;
    if (userId) {
      if (this.teacherImages.has(userId)) {
        return this.teacherImages.get(userId)!;
      }
      const imgPath = user.profileImagePath;
      if (imgPath) {
        this.userService.getProfileImage(imgPath).subscribe({
          next: (res) => {
            const imageUrl = URL.createObjectURL(res);
            this.teacherImages.set(userId, imageUrl);
          },
          error: () => {
            this.teacherImages.set(userId, '/images/user-default-img.webp');
          },
        });
      } else {
        this.teacherImages.set(userId, '/images/user-default-img.webp');
      }
    }

    return '/images/user-default-img.webp';
  }

  fetchCourseImage(course: CourseOverviewDto) {
    const imgPath = course.imagePath;
    if (imgPath) {
      return this.courseService.getCourseImage(imgPath);
    }
    return undefined;
  }

  navigateToCourses() {
    this.router.navigate(['/courses']);
  }

  navigateToCourseDetails(courseId: number) {
    this.router.navigate(['/courses/', courseId]);
  }

  navigateToTeacherProfile(userId: number | undefined) {
    if (userId) {
      this.router.navigate([`user/${userId}/profile`]);
    }
  }

  scroll(direction: number) {
    if (direction === 1 && this.currentIndex < this.maxIndex()) {
      this.currentIndex++;
    } else if (direction === -1 && this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  getTransform(): string {
    const cardWidth = 300;
    const gap = 16;
    const totalCardWidth = cardWidth + gap;
    return `translateX(-${this.currentIndex * totalCardWidth}px)`;
  }
}
