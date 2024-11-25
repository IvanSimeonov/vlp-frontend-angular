import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseCardComponent, ICourse } from '../../features/course/course-card/course-card.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, CourseCardComponent],
})
export class HomepageComponent {
  courses: ICourse[] = [
    {
      title: '1 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '2 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '3 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '4 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '5 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '6 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '7 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '8 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: '9 The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
  ];

  topTeachers = [
    {
      name: 'John Doe',
      bio: 'Expert in Machine Learning and AI with 10+ years of experience.',
      photo: '/images/user-default-img.webp',
    },
    {
      name: 'John Doe',
      bio: 'Expert in Machine Learning and AI with 10+ years of experience.',
      photo: '/images/user-default-img.webp',
    },
    {
      name: 'John Doe',
      bio: 'Expert in Machine Learning and AI with 10+ years of experience.',
      photo: '/images/user-default-img.webp',
    },
  ];

  currentIndex = 0;
  slideDirection = 0;

  navigateToCourses() {
    console.log('navigated to courses');
  }

  scroll(direction: number) {
    const totalCourses = this.courses.length - 2;

    if (direction === 1) {
      this.currentIndex = (this.currentIndex + 1) % totalCourses;
    } else if (direction === -1) {
      this.currentIndex = (this.currentIndex - 1 + totalCourses) % totalCourses;
    }
  }

  getTransform(): string {
    const cardWidth = 100;
    return `translateX(-${this.currentIndex * cardWidth}%)`;
  }
}