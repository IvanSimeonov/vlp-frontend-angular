import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CourseCreateEditFormComponent,
  ICourse,
  ITopic,
} from '../../features/course/course-create-edit-form/course-create-edit-form.component';
import { FileUploadComponent, IFile } from '../../components/file-upload/file-upload.component';
import { ILecture } from '../course-details/course-details.component';

@Component({
  selector: 'app-course-create-edit',
  standalone: true,
  imports: [MatStepperModule, MatButtonModule, CourseCreateEditFormComponent, FileUploadComponent],
  templateUrl: './course-create-edit.component.html',
  styleUrl: './course-create-edit.component.scss',
})
export class CourseCreateEditComponent implements OnInit {
  topics = signal<ITopic[]>([]);

  isCourseCreated = signal(false);
  isPhotoUploaded = signal(false);
  areLecturesAdded = signal(false);
  courseId = signal(-1);

  ngOnInit(): void {
    // TODO: Add API call
    this.topics.set([
      {
        id: 1,
        title: 'Software Development',
        description: 'Learn programming languages and tools to build efficient software solutions.',
        totalCourses: 5,
      },
      {
        id: 2,
        title: 'Science',
        description: 'Explore major scientific disciplines and discover how science explains our world.',
        totalCourses: 4,
      },
      {
        id: 3,
        title: 'Business',
        description: 'Master essential business skills from management to finance for organizational success.',
        totalCourses: 4,
      },
      {
        id: 4,
        title: 'Engineering',
        description: 'Study engineering principles and technologies across various engineering fields.',
        totalCourses: 3,
      },
      {
        id: 5,
        title: 'Personal Development',
        description: 'Develop life skills, productivity habits, and strategies for personal growth.',
        totalCourses: 4,
      },
      {
        id: 6,
        title: 'Design',
        description: 'Learn visual design principles and tools for creating compelling digital content.',
        totalCourses: 2,
      },
      {
        id: 7,
        title: 'Health & Wellness',
        description: 'Discover practices for improving physical and mental well-being.',
        totalCourses: 2,
      },
    ]);
  }

  handleCourseCreated(courseData: ICourse): void {
    // TODO: Add API call
    console.log('Created Course: ', courseData);
    this.courseId.set(1);
    this.isCourseCreated.set(true);
  }

  handlePhotoUploaded(photo: IFile): void {
    // TODO: Add API call
    console.log('Uploaded Photo: ', photo);
    this.isPhotoUploaded.set(true);
  }

  handleLecturesAdded(lectures: ILecture[]): void {
    // TODO: Add API call
    console.log('Added lectures: ', lectures);
    if (lectures.length >= 3) {
      this.areLecturesAdded.set(true);
    }
  }

  publishCourse(): void {
    // TODO: Add API call
    console.log('Course published!');
  }

  deleteCourseAndContent(): void {
    // TODO: Add API call
    console.log('');
  }
}
