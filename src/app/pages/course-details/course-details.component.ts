import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AssignmentSolutionListComponent } from '../../features/assignment-solutions/assignment-solution-list/assignment-solution-list.component';
import { CourseControllerService, CourseDetailsDto, LectureDetailDto } from '@ivannicksim/vlp-backend-openapi-client';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EnumUtils } from '../../shared/helpers/EnumUtils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileService } from '../../services/user/user-profile.service';

export interface IAssignmentSolution {
  id?: number;
  submissionFilePath?: string;
  submissionStatus?: string;
  grade?: number | undefined;
  student?: {
    id?: number;
    name?: string;
  };
}

export interface ILecture {
  title?: string;
  fullDescription?: string;
  videoUrl?: string;
  assignmentTask?: string;
  sequenceNumber?: number;
  assignmentSolutions?: IAssignmentSolution[];
}

export interface ICourseDetails {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  requirements?: string;
  topic?: string;
  rating?: number;
  totalVotes?: number;
  lastUpdated?: string;
  author?: string;
  lectures?: ILecture[];
  passingScore?: number;
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    StarRatingComponent,
    MatListModule,
    MatExpansionModule,
    SafeUrlPipe,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    AssignmentSolutionListComponent,
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseControllerService);
  private userProfileService = inject(UserProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  course = signal<CourseDetailsDto | null>(null);
  user = computed(() => this.userProfileService.userProfile());
  isLoading = signal<boolean>(false);
  lectures = signal<LectureDetailDto[]>([]);
  totalLectures = computed<number>(() => this.lectures().length);
  assignments = signal<IAssignmentSolution[]>([]);
  courseImageUrl: string | undefined;

  isUserEnrolled = computed<boolean>(() => {
    const currentUser = this.user();
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    return currentUser?.enrolledCoursesIds?.includes(courseId) ?? false;
  });

  isUserCompletedCourse = computed<boolean>(() => {
    const currentUser = this.user();
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    return currentUser?.completedCoursesIds?.includes(courseId) ?? false;
  });

  isUserCourseAuthor = computed<boolean>(() => {
    const currentUser = this.user();
    const course = this.course();
    return currentUser?.id === course?.author?.id;
  });

  isUserLoggedIn = computed<boolean>(() => this.user() !== null);

  ngOnInit(): void {
    this.initializeCourse();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  canUserEnroll(): boolean {
    return (
      this.isUserLoggedIn() && !this.isUserEnrolled() && !this.isUserCompletedCourse() && !this.isUserCourseAuthor()
    );
  }

  canUserEditDeteleCourse(): boolean {
    return this.isUserLoggedIn() && this.isUserCourseAuthor();
  }

  private initializeCourse(): void {
    this.isLoading.set(true);
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const courseId = params['id'];
          if (courseId) {
            return this.fetchCourse(params['id']);
          } else {
            this.isLoading.set(false);
            return EMPTY;
          }
        })
      )
      .subscribe({
        error: this.handleError.bind(this),
        complete: () => this.isLoading.set(false),
      });
  }

  private fetchCourse(courseId: number): Observable<CourseDetailsDto> {
    return this.courseService.getCourseDetailsById(courseId).pipe(
      delay(300),
      tap((course) => {
        this.course.set(course);
        this.fetchCourseImage();
      })
    );
  }

  fetchCourseImage() {
    const imgPath = this.course()?.imagePath;
    if (imgPath) {
      this.courseService.getCourseImage(imgPath).subscribe({
        next: (res) => {
          this.courseImageUrl = URL.createObjectURL(res);
        },
        error: () => {
          this.courseImageUrl = undefined;
        },
      });
    }
    this.courseImageUrl = undefined;
  }

  private handleError(error: string): void {
    console.error(error);
    this.isLoading.set(false);
  }

  formatLecturePanelTitle(idx: number, title: string | undefined): string {
    return `${idx + 1}. ${title}`;
  }

  formatDifficultyLevel(): string {
    const difficulyLevel = this.course()?.difficultyLevel;
    if (difficulyLevel) {
      return EnumUtils.formatDifficultyLevel(difficulyLevel);
    }
    return '';
  }

  onEnroll(): void {
    console.log('Enroll course');
    const courseId = this.course()?.id;
    if (courseId) {
      this.userProfileService.refreshAfterStateChange(this.courseService.enrollUserToCourse(courseId)).subscribe({
        next: () => {
          this.snackBar.open('Enrolled to course successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error enrolling to course', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onEdit(): void {
    const courseId = this.course()?.id;
    if (courseId) {
      this.router.navigate(['/courses/edit', courseId]);
    }
  }

  onDelete(): void {
    const courseId = this.course()?.id;
    if (courseId) {
      this.courseService.deleteCourseById(courseId).subscribe({
        next: () => {
          this.snackBar.open('Course deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/courses']);
        },
        error: () => {
          this.snackBar.open('Course cannot be deleted. Students exist!', 'Close', { duration: 3000 });
        },
      });
    }
  }
}
