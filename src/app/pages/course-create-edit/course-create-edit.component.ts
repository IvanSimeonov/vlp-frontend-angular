import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CourseCreateEditFormComponent,
  DifficultyLevel,
  ITopic,
} from '../../features/course/course-create-edit-form/course-create-edit-form.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { LectureManagementComponent } from '../../features/lecture/lecture-management/lecture-management.component';
import { ActivatedRoute } from '@angular/router';

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

export interface ICourseDetails {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  requirements?: string;
  topic?: number;
  difficultyLevel?: DifficultyLevel;
  rating?: number;
  totalVotes?: number;
  lastUpdated?: string;
  author?: string;
  lectures?: ILecture[];
  passingScore?: number;
  courseImage?: IFile;
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
  ],
  templateUrl: './course-create-edit.component.html',
  styleUrl: './course-create-edit.component.scss',
})
export class CourseCreateEditComponent implements OnInit {
  topics = signal<ITopic[]>([]);

  isCourseCreated = signal(false);
  isPhotoUploaded = signal(false);
  areLecturesAdded = signal(false);
  courseId = signal(-1);
  isEditMode = signal(false);
  courseData = signal<ICourseDetails | null>(null);
  fileData: IFile | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTopics();
    this.isEditMode.set(this.route.snapshot.data['editMode']);
    if (this.isEditMode()) {
      this.courseId.set(Number(this.route.snapshot.paramMap.get('id')));
      if (this.courseId()) {
        this.loadCourse();
      }
    }
  }

  handleCourseCreated(courseData: ICourseDetails): void {
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
    console.log('Course Deleted!');
  }

  private async dummyImageLoader() {
    const response = await fetch('/images/course-default-img.jpeg');
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed');
    }
    const blob = await response.blob();
    console.log(blob);
    const file = new File([blob], 'course-default-img.jpeg', { type: blob.type });
    console.log(file);
    return { name: file.name, file: file };
  }

  private loadTopics(): void {
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

  private loadCourse(): void {
    // TODO: Add API call
    this.courseData.set({
      title: 'Mastering Angular',
      shortDescription: 'Learn Angular from basics to advanced concepts in this comprehensive course.',
      fullDescription:
        '<p>This course is designed to provide an in-depth understanding of modern web development, covering both front-end and back-end technologies. Whether you are a complete beginner or have some experience in coding, this course will equip you with the skills and knowledge required to build, maintain, and optimize websites and web applications.</p><p><strong>What you will learn:</strong></p><ul><li>Core concepts of HTML, CSS, and JavaScript.</li><li>Frameworks such as Angular, React, and Vue.js.</li><li>Server-side programming with Node.js and Express.</li><li>Database management with MySQL and MongoDB.</li><li>Version control using Git and GitHub.</li><li>Deployment of web applications to live environments.</li></ul><p>Throughout the course, you will work on multiple hands-on projects, enabling you to apply the concepts in real-world scenarios. These projects include creating responsive websites, dynamic web applications, and RESTful APIs, among others.</p><p>By the end of this course, you will have a portfolio of projects that showcase your skills to potential employers and clients.</p><p><strong>Who should take this course?</strong></p><p>This course is ideal for aspiring web developers, freelancers, and anyone interested in building their own websites or web applications. No prior programming experience is required, but familiarity with computers and basic internet usage is recommended.</p>',
      requirements:
        '<ul><li>Basic familiarity with computers and the internet.</li><li>A computer with internet access for hands-on practice.</li><li>Willingness to learn and complete exercises and projects.</li></ul>',

      topic: 1,
      difficultyLevel: DifficultyLevel.ADVANCED,
      rating: 4.8,
      totalVotes: 12345,
      lastUpdated: '2024-11-27',
      author: 'Jane Doe',
      lectures: [
        {
          title: 'Introduction to Angular',
          description:
            '<p><strong>Welcome to Angular!</strong></p><p>In this lecture, we will cover the basics of Angular, its purpose, and its architecture.</p>',
          videoUrl: 'HSJBbCN6GjU',
          assignmentTask: 'Write a brief essay about the benefits of using Angular.',
          sequenceNumber: 1,
          courseId: 1,
        },
        {
          title: 'Components and Templates',
          description:
            '<p><strong>Understanding Components</strong></p><p>This lecture dives into Angular components and how to use templates to build dynamic UIs.</p>',
          videoUrl: 'wZ6cST5pexo',
          assignmentTask: 'Create a simple component that displays your favorite hobby.',
          sequenceNumber: 2,
          courseId: 1,
        },
        {
          title: 'Directives and Pipes',
          description:
            '<p><strong>Enhancing Templates</strong></p><p>Learn how to use directives and pipes to manipulate DOM elements and format data dynamically.</p>',
          videoUrl: 'ADQy4805YxY',
          assignmentTask: 'Implement a custom pipe that formats dates in your preferred format.',
          sequenceNumber: 3,
          courseId: 1,
        },
      ],
      courseImage: this.fileData,
      passingScore: 70,
    });
  }
}
