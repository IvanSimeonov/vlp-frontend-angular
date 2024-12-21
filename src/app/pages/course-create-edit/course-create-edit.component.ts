import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CourseCreateEditFormComponent } from '../../features/course/course-create-edit-form/course-create-edit-form.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { LectureManagementComponent } from '../../features/lecture/lecture-management/lecture-management.component';
import { ActivatedRoute } from '@angular/router';
import {
  CourseControllerService,
  CourseCreateDto,
  CourseUpdateDto,
  LectureControllerService,
  LectureDetailDto,
  LectureDto,
  TopicControllerService,
  TopicOverviewDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface IFile {
  name: string;
  file: File;
}

export interface ILecture {
  title: string;
  description: string;
  videoUrl: string;
  assignmentTask: string;
  sequenceNumber: number;
  courseId: number;
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
  ],
  templateUrl: './course-create-edit.component.html',
  styleUrl: './course-create-edit.component.scss',
})
export class CourseCreateEditComponent implements OnInit {
  private courseService = inject(CourseControllerService);
  private topicService = inject(TopicControllerService);
  private lectureService = inject(LectureControllerService);
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
    console.log(courseData);
    if (this.isEditMode()) {
      this.courseService
        .updateCourseById(this.courseId(), {
          id: this.courseId(),
          ...courseData,
        })
        .subscribe({
          next: (response) => {
            this.isCourseCreated.set(true);
            console.log('Updated Course: ', response);
          },
          error: (error) => {
            console.error('Error updating course: ', error);
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
        },
        error: (error) => {
          console.error('Error creating course: ', error);
        },
      });
    }
  }

  handlePhotoUploaded(photo: IFile): void {
    this.courseService.uploadCourseImage(this.courseId(), photo.file).subscribe({
      next: (response) => {
        console.log('Uploaded Photo Response: ', response);
      },
      error: (error) => {
        console.error('Error uploading photo: ', error);
      },
    });
    this.isPhotoUploaded.set(true);
  }

  handleLecturesAdded(lectures: LectureDto[]): void {
    console.log('Added lectures: ', lectures);
    if (lectures.length >= 3) {
      this.areLecturesAdded.set(true);
      console.log('More than 3 Lectures: ', lectures.length);
      this.lectureService.updateLectures(this.courseId(), lectures).subscribe({
        next: (response) => {
          console.log('Updated Lectures: ', response);
        },
        error: (error) => {
          console.error('Error updating lectures: ', error);
        },
      });
    }
  }

  publishCourse(): void {
    // TODO: Add API call
    console.log('Course published!');
  }

  deleteCourseAndContent(): void {
    // TODO: Add API call
    console.log('Course Deleted!');
  }

  private loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (response) => {
        this.topics.set(response);
      },
      error: (error) => {
        console.error('Error fetching topics: ', error);
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
      error: (error) => {
        console.error('Error fetching course data: ', error);
      },
    });
  }

  private loadCourseLectures(courseId: number): void {
    this.lectureService.getAllLectureDetailsByCourseId(courseId).subscribe({
      next: (response) => {
        this.courseLecturesData.set(response);
      },
      error: (error) => {
        console.error('Error fetching lectures: ', error);
      },
    });
  }
}
