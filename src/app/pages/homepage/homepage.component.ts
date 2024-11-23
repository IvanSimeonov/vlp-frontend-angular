import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class HomepageComponent implements OnInit {
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

  visibleCourses: ICourse[] = [];
  currentIndex = 0;
  slideDirection = 0;

  ngOnInit() {
    this.visibleCourses = this.courses.slice(0, 3);
  }

  navigateToCourses() {
    console.log('navigated to courses');
  }

  scroll(direction: number) {
    this.slideDirection = direction;
    this.updateVisibleCourses(direction);
  }

  updateVisibleCourses(direction: number) {
    const totalCourses = this.courses.length;

    if (direction === 1) {
      const nextIndex = (this.currentIndex + 3) % totalCourses;
      this.visibleCourses = [...this.visibleCourses.slice(1), this.courses[nextIndex]];
      this.currentIndex = (this.currentIndex + 1) % totalCourses;
    } else if (direction === -1) {
      const prevIndex = (this.currentIndex - 1 + totalCourses) % totalCourses;
      this.visibleCourses = [this.courses[prevIndex], ...this.visibleCourses.slice(0, -1)];
      this.currentIndex = (this.currentIndex - 1 + totalCourses) % totalCourses;
    }
  }
}
