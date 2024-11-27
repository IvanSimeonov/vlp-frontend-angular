import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-course-filter',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './course-filter.component.html',
  styleUrl: './course-filter.component.scss',
})
export class CourseFilterComponent {
  difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  topics = [
    'Software Development',
    'Science',
    'Business',
    'Engineering',
    'Personal Development',
    'Design',
    'Health & Wellness',
  ];

  title = '';
  author = '';
  selectedDifficulty = '';
  selectedTopic = '';

  @Output() filter = new EventEmitter<{
    title: string;
    author: string;
    difficulty: string;
    topic: string;
  }>();

  @Output() resetFilter = new EventEmitter<void>();

  onFilter(): void {
    this.filter.emit({
      title: this.title.trim(),
      author: this.author.trim(),
      difficulty: this.selectedDifficulty,
      topic: this.selectedTopic,
    });
  }

  onReset(): void {
    this.title = '';
    this.author = '';
    this.selectedDifficulty = '';
    this.selectedTopic = '';
    this.resetFilter.emit();
  }
}
