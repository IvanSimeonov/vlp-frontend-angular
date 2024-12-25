import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CourseCreateEditFormComponent } from '../../features/course/course-create-edit-form/course-create-edit-form.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { LectureManagementComponent } from '../../features/lecture/lecture-management/lecture-management.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CourseControllerService,
  CourseCreateDto,
  CourseStatusUpdateDto,
  CourseUpdateDto,
  LectureControllerService,
  LectureDetailDto,
  LectureDto,
  TopicControllerService,
  TopicOverviewDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface IFile {
  name: string;
  file: File;
}

@Component({
  selector: 'app-course-create-edit',
  standalone: true,
  imports: [
    MatStepperModule,
    MatButtonModule,
    CourseCreateEditFormComponent,
    FileUploadComponent,
    LectureManagementComponent,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './course-create-edit.component.html',
  styleUrl: './course-create-edit.component.scss',
})
export class CourseCreateEditComponent implements OnInit {
  private courseService = inject(CourseControllerService);
  private topicService = inject(TopicControllerService);
  private lectureService = inject(LectureControllerService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  topics = signal<TopicOverviewDto[] | undefined>([]);

  isCourseCreated = signal(false);
  isPhotoUploaded = signal(false);
  areLecturesAdded = signal(false);
  courseId = signal(-1);
  isEditMode = signal(false);
  courseData = signal<CourseCreateDto | CourseUpdateDto | null>(null);
  createdCourseData = signal<CourseUpdateDto | undefined>(undefined);
  fileData: IFile | undefined;
  courseLecturesData = signal<LectureDetailDto[] | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTopics();
    this.isEditMode.set(this.route.snapshot.data['editMode']);
    if (this.isEditMode()) {
      this.courseId.set(Number(this.route.snapshot.paramMap.get('id')));
      if (this.courseId()) {
        this.loadCourse(this.courseId());
        this.loadCourseLectures(this.courseId());
      }
    }
  }

  handleCourseCreated(courseData: CourseCreateDto): void {
    if (this.isEditMode()) {
      this.courseService
        .updateCourseById(this.courseId(), {
          id: this.courseId(),
          ...courseData,
        })
        .subscribe({
          next: () => {
            this.isCourseCreated.set(true);
            this.snackBar.open('Course updated successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Course update failed! Try agian lated.', 'Close', { duration: 3000 });
          },
        });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: (response) => {
          this.createdCourseData.set({
            id: response,
            ...courseData,
          });
          this.isCourseCreated.set(true);
          this.courseId.set(response);
          this.snackBar.open('Course created successfully!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Course creation failed!', 'Close', { duration: 3000 });
        },
      });
    }
  }

  handlePhotoUploaded(photo: IFile): void {
    this.courseService.uploadCourseImage(this.courseId(), photo.file).subscribe({
      next: () => {
        this.snackBar.open('Course photo uplaoded successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error uploading course photo. Please try again!', 'Close', { duration: 3000 });
      },
    });
    this.isPhotoUploaded.set(true);
  }

  handleLecturesAdded(lectures: LectureDto[]): void {
    if (lectures.length >= 3) {
      this.areLecturesAdded.set(true);
      this.lectureService.updateLectures(this.courseId(), lectures).subscribe({
        next: () => {
          this.snackBar.open('Lectures updated successfully!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Updating lectures failed! Please try again.', 'Close', { duration: 3000 });
        },
      });
    }
  }

  publishCourse(): void {
    if (this.courseLecturesData() && this.courseLecturesData()!.length < 3) {
      this.snackBar.open('You need to add at least 3 lectures to publish the course!', 'Close', { duration: 3000 });
      return;
    }
    this.courseService
      .updateCourseStatusById(this.courseId(), { status: CourseStatusUpdateDto.StatusEnum.Published })
      .subscribe({
        next: () => {
          this.snackBar.open('Course published successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/my-courses']);
        },
        error: () => {
          this.snackBar.open('Course could not be published! Please try again.', 'Close', { duration: 3000 });
        },
      });
  }

  deleteCourseAndContent(): void {
    this.courseService.deleteCourseById(this.courseId()).subscribe({
      next: () => {
        this.snackBar.open('Course deleted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/my-courses']);
      },
      error: () => {
        this.snackBar.open('Course could not be deleted! Please try again later.', 'Close', { duration: 3000 });
      },
    });
  }

  private loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (response) => {
        this.topics.set(response);
      },
      error: () => {
        this.snackBar.open('Topics cannot be fetched!', 'Close', { duration: 3000 });
      },
    });
  }

  private loadCourse(courseId: number): void {
    this.courseService.getCourseDetailsById(courseId).subscribe({
      next: (response) => {
        const courseUpdateDto: CourseUpdateDto = {
          id: response.id!,
          title: response.title!,
          shortDescription: response.shortDescription!,
          fullDescription: response.fullDescription!,
          requirements: response.requirements!,
          passingScore: response.passingScore!,
          difficultyLevel: response.difficultyLevel!,
          topicId: response.topicOverviewDto!.id!,
          authorId: response.author!.id!,
        };
        this.createdCourseData.set(courseUpdateDto);
      },
      error: () => {
        this.snackBar.open('Course cannot be fetched!', 'Close', { duration: 3000 });
      },
    });
  }

  private loadCourseLectures(courseId: number): void {
    this.lectureService.getAllLectureDetailsByCourseId(courseId).subscribe({
      next: (response) => {
        this.courseLecturesData.set(response);
      },
      error: () => {
        this.snackBar.open('Lectures cannot be fetched!', 'Close', { duration: 3000 });
      },
    });
  }
}
