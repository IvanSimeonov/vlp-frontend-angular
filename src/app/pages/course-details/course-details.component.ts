import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class CourseDetailsComponent {
  isUserEnrolled = true;
  isUserCourseAuthor = false;
  isUserLoggedIn = true;
  course: ICourseDetails | null = {
    title: 'Mastering Angular',
    shortDescription: 'Learn Angular from basics to advanced concepts in this comprehensive course.',
    fullDescription:
      '<p>This course is designed to provide an in-depth understanding of modern web development, covering both front-end and back-end technologies. Whether you are a complete beginner or have some experience in coding, this course will equip you with the skills and knowledge required to build, maintain, and optimize websites and web applications.</p><p><strong>What you will learn:</strong></p><ul><li>Core concepts of HTML, CSS, and JavaScript.</li><li>Frameworks such as Angular, React, and Vue.js.</li><li>Server-side programming with Node.js and Express.</li><li>Database management with MySQL and MongoDB.</li><li>Version control using Git and GitHub.</li><li>Deployment of web applications to live environments.</li></ul><p>Throughout the course, you will work on multiple hands-on projects, enabling you to apply the concepts in real-world scenarios. These projects include creating responsive websites, dynamic web applications, and RESTful APIs, among others.</p><p>By the end of this course, you will have a portfolio of projects that showcase your skills to potential employers and clients.</p><p><strong>Who should take this course?</strong></p><p>This course is ideal for aspiring web developers, freelancers, and anyone interested in building their own websites or web applications. No prior programming experience is required, but familiarity with computers and basic internet usage is recommended.</p>',
    requirements:
      '<ul><li>Basic familiarity with computers and the internet.</li><li>A computer with internet access for hands-on practice.</li><li>Willingness to learn and complete exercises and projects.</li></ul>',

    topic: 'Web Development',
    rating: 4.8,
    totalVotes: 12345,
    lastUpdated: '2024-11-27',
    author: 'Jane Doe',
    lectures: [
      {
        title: 'Introduction to Angular',
        fullDescription:
          '<p><strong>Welcome to Angular!</strong></p><p>In this lecture, we will cover the basics of Angular, its purpose, and its architecture.</p>',
        videoUrl: 'HSJBbCN6GjU',
        assignmentTask: 'Write a brief essay about the benefits of using Angular.',
        sequenceNumber: 1,
        assignmentSolutions: [
          {
            id: 101,
            submissionFilePath: '/path/to/file1.pdf',
            submissionStatus: 'SUBMITTED',
            grade: 85,
            student: { id: 1, name: 'John Doe' },
          },
          {
            id: 102,
            submissionFilePath: '/path/to/file2.pdf',
            submissionStatus: 'SUBMITTED',
            grade: undefined,
            student: { id: 2, name: 'Jane Smith' },
          },
          {
            id: 103,
            submissionFilePath: '/path/to/file2.pdf',
            submissionStatus: 'SUBMITTED',
            grade: undefined,
            student: { id: 2, name: 'Jane Smith' },
          },
          {
            id: 104,
            submissionFilePath: '/path/to/file2.pdf',
            submissionStatus: 'SUBMITTED',
            grade: undefined,
            student: { id: 2, name: 'Jane Smith' },
          },
          {
            id: 105,
            submissionFilePath: '/path/to/file2.pdf',
            submissionStatus: 'SUBMITTED',
            grade: undefined,
            student: { id: 2, name: 'Jane Smith' },
          },
        ],
      },
      {
        title: 'Components and Templates',
        fullDescription:
          '<p><strong>Understanding Components</strong></p><p>This lecture dives into Angular components and how to use templates to build dynamic UIs.</p>',
        videoUrl: 'wZ6cST5pexo',
        assignmentTask: 'Create a simple component that displays your favorite hobby.',
        sequenceNumber: 2,
      },
      {
        title: 'Directives and Pipes',
        fullDescription:
          '<p><strong>Enhancing Templates</strong></p><p>Learn how to use directives and pipes to manipulate DOM elements and format data dynamically.</p>',
        videoUrl: 'ADQy4805YxY',
        assignmentTask: 'Implement a custom pipe that formats dates in your preferred format.',
        sequenceNumber: 3,
      },
    ],
    passingScore: 70,
  };

  formatLecturePanelTitle(idx: number, title: string | undefined): string {
    return `${idx + 1}. ${title}`;
  }
}
