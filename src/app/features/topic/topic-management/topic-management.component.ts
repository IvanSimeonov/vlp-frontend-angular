import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { TopicCardComponent } from '../topic-card/topic-card.component';
import { TopicCreateEditDialogComponent } from '../topic-create-edit-dialog/topic-create-edit-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

export interface ITopic {
  id?: number;
  title?: string;
  description?: string;
  totalCourses?: number;
}

@Component({
  selector: 'app-topic-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TopicCardComponent,
    TopicCreateEditDialogComponent,
  ],
  templateUrl: './topic-management.component.html',
  styleUrl: './topic-management.component.scss',
})
export class TopicManagementComponent {
  private dialog = inject(MatDialog);

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
  isLoading = signal(false);
  pageSize = 10;
  title = '';

  paginate(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }

  openDialog(topic: ITopic | null = null): void {
    this.dialog.open(TopicCreateEditDialogComponent, {
      width: '20vw',
      minHeight: '30vh',
      data: topic,
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '100ms',
      autoFocus: false,
    });
  }
}
