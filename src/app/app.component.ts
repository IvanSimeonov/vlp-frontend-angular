import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {
  CourseCreateEditFormComponent,
  ITopic,
} from './features/course/course-create-edit-form/course-create-edit-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CourseCreateEditFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  topics: ITopic[] = [
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
  ];
}
