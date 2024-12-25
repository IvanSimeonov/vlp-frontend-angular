import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AssignmentSolutionListComponent } from '../../features/assignment-solutions/assignment-solution-list/assignment-solution-list.component';
import {
  AssignmentSolutionControllerService,
  AssignmentSolutionDto,
  CourseControllerService,
  CourseDetailsDto,
  LectureControllerService,
  LectureDetailDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, EMPTY, forkJoin, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EnumUtils } from '../../shared/helpers/EnumUtils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileService } from '../../services/user/user-profile.service';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { YoutubeVideoComponent } from '../../components/youtube-video/youtube-video.component';

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
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    FileUploadComponent,
    AssignmentSolutionListComponent,
    YoutubeVideoComponent,
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseControllerService);
  private lectureService = inject(LectureControllerService);
  private userProfileService = inject(UserProfileService);
  private assignmentSolutionService = inject(AssignmentSolutionControllerService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  allowedFileTypes: string[] = ['application/pdf', 'application/msword'];
  maxFileSizeMB = 50;

  course = signal<CourseDetailsDto | null>(null);
  user = computed(() => this.userProfileService.userProfile());
  isLoading = signal<boolean>(false);
  lectures = signal<LectureDetailDto[]>([]);
  totalLectures = computed<number>(() => this.lectures().length);
  assignments = signal<AssignmentSolutionDto[]>([]);
  courseImageUrl: string | undefined;
  assignmentSolutions = signal<Map<number, AssignmentSolutionDto>>(new Map());
  allUsersSolutions = signal<AssignmentSolutionDto[]>([]);

  lectureAccessibility = signal<Map<number, boolean>>(new Map());

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
            return forkJoin({
              course: this.fetchCourse(courseId),
              lectures: this.fetchLectures(courseId),
              assignments: this.fetchUserAssignments(courseId),
              allUsersSolutions: this.assignmentSolutionService.getAllSolutionsByCourseId(courseId),
            });
          } else {
            this.isLoading.set(false);
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: ({ course, lectures, assignments, allUsersSolutions }) => {
          this.course.set(course);
          this.lectures.set(lectures);
          this.updateAssignments(assignments);
          this.allUsersSolutions.set(allUsersSolutions);
          this.updateLectureAccess();
        },
        error: this.handleError.bind(this),
        complete: () => this.isLoading.set(false),
      });
  }

  private fetchUserAssignments(courseId: number): Observable<AssignmentSolutionDto[]> {
    const userId = this.user()?.id;
    if (!userId) {
      return of([]);
    }
    return this.assignmentSolutionService.getAllSolutionsByCourseAndUser(courseId, userId);
  }

  private updateAssignments(assignments: AssignmentSolutionDto[]) {
    if (!assignments || !Array.isArray(assignments)) {
      this.assignmentSolutions.set(new Map());
      return;
    }
    const solutionsMap = new Map<number, AssignmentSolutionDto>(
      assignments.map((solution) => [solution.lectureId!, solution])
    );
    console.log('Updated assignments', solutionsMap);
    this.assignmentSolutions.set(solutionsMap);
    console.log('Updated assignments solutions', this.assignmentSolutions());
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

  private fetchLectures(courseId: number): Observable<LectureDetailDto[]> {
    return this.lectureService.getAllLectureDetailsByCourseId(courseId).pipe(
      delay(300),
      tap((lectures) => {
        console.log(lectures);
        this.lectures.set(lectures);
      })
    );
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

  isLectureAccessible(lectureIndex: number): boolean {
    // First lecture is always accessible
    if (lectureIndex === 0) {
      return true;
    }

    // Special cases for course author or completed course
    if (this.isUserCompletedCourse() || this.isUserCourseAuthor()) {
      return true;
    }

    // Must be enrolled to access lectures
    if (!this.isUserEnrolled()) {
      return false;
    }

    // Get the current lecture's details
    const currentLecture = this.lectures()[lectureIndex];
    const previousLecture = this.lectures()[lectureIndex - 1];

    console.log('Checking accessibility for:', {
      currentLectureId: currentLecture?.id,
      previousLectureId: previousLecture?.id,
      solutions: Array.from(this.assignmentSolutions().entries()),
      hasPreviousSubmission: this.assignmentSolutions().has(previousLecture.id!),
    });

    // Check if previous lecture has a submission
    return this.assignmentSolutions().has(previousLecture.id!);
  }

  onFileUpload(lectureId: number, file: File): void {
    this.isLoading.set(true);
    this.assignmentSolutionService.uploadAssignmentSolution(lectureId, file).subscribe({
      next: (solution) => {
        const currentSolutions = this.assignmentSolutions();
        console.log('Current solutions before update: ', currentSolutions.entries());

        const updatedSolutions = new Map(currentSolutions);
        updatedSolutions.set(lectureId, solution);
        this.assignmentSolutions.set(updatedSolutions);

        console.log('Solutions after update: ', this.assignmentSolutions());
        this.updateLectureAccess();
        setTimeout(() => {
          this.updateLectureAccess();
        }, 0);
        this.snackBar.open('Assignment submitted successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error submitting assignment', error);
        this.snackBar.open('Error submitting assignment', 'Close', { duration: 3000 });
      },
      complete: () => this.isLoading.set(false),
    });
  }

  private updateLectureAccess() {
    const lectures = this.lectures();
    const accessibilityMap = new Map(this.lectureAccessibility());
    for (let i = 0; i < lectures.length; i++) {
      const isAccessible = this.isLectureAccessible(i);
      accessibilityMap.set(lectures[i].id!, isAccessible);
    }
    this.lectureAccessibility.set(accessibilityMap);
  }

  getAssignmentSolution(lectureId: number) {
    const solution = this.assignmentSolutions().get(lectureId);
    return solution || undefined;
  }

  getAssignmentSolutionFileName(lectureId: number) {
    const solution = this.getAssignmentSolution(lectureId);
    if (!solution?.submissionFilePath) {
      return '';
    }
    return solution?.submissionFilePath.split('/').pop() || 'Assignment Solution';
  }

  getAssignmentSolutionGrade(lectureId: number) {
    const solution = this.getAssignmentSolution(lectureId);
    if (!solution?.grade) {
      return 'N/A';
    }
    return solution.grade;
  }

  downloadAssignmentSolution(lectureId: number) {
    const solutionId = this.getAssignmentSolution(lectureId)?.id;
    if (solutionId) {
      this.assignmentSolutionService.downloadAssignmentSolution(solutionId).subscribe({
        next: (res) => {
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.getAssignmentSolutionFileName(lectureId);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading assignment solution', error);
          this.snackBar.open('Error downloading assignment solution', 'Close', { duration: 3000 });
        },
      });
    }
  }

  filteredAssignments(lectureId: number) {
    return this.allUsersSolutions().filter((assignment) => assignment.lectureId === lectureId);
  }

  fetchAllUsersSolutions() {
    const courseId = this.course()?.id;
    if (courseId) {
      this.assignmentSolutionService.getAllSolutionsByCourseId(courseId).subscribe({
        next: (result: AssignmentSolutionDto[]) => {
          this.allUsersSolutions.set(result);
        },
        error: (error) => console.error('Submissions error: ', error),
      });
    }
  }

  onGradeUpdated() {
    const courseId = this.course()?.id;
    if (courseId) {
      this.assignmentSolutionService.getAllSolutionsByCourseId(courseId).subscribe({
        next: (solutions) => {
          this.allUsersSolutions.set(solutions);
        },
        error: (error) => {
          console.error('Error fetching solutions: ', error);
        },
      });
    }
  }
}
