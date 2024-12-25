import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AssignmentSolutionControllerService,
  AssignmentSolutionDto,
  UserControllerService,
} from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-assignment-solution-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './assignment-solution-card.component.html',
  styleUrl: './assignment-solution-card.component.scss',
})
export class AssignmentSolutionCardComponent {
  private userService = inject(UserControllerService);
  private assignmentSolutionService = inject(AssignmentSolutionControllerService);
  private snackBar = inject(MatSnackBar);

  solution = input.required<AssignmentSolutionDto>();
  isTeacher = input(false);
  isDownloading = signal(false);
  studentNameSignal = signal<string>('Loading...');
  studentName = computed(() => this.studentNameSignal());
  fileName = computed(() => {
    const path = this.solution().submissionFilePath;
    return path ? path.split('/').pop() : 'Assignment Solution';
  });
  displayGrade = computed(() => {
    const grade = this.solution().grade;
    return grade !== undefined && grade !== null ? `${grade}/100` : 'Not Graded';
  });
  gradeAssignment = output();

  constructor() {
    effect((onCleanup) => {
      const studentId = this.solution().userId;
      if (studentId) {
        const subscription = this.userService.getUserPublicProfile(studentId).subscribe({
          next: (response) => {
            this.studentNameSignal.set(`${response.firstName} ${response.lastName}`);
          },
          error: () => {
            this.studentNameSignal.set('Unknown Student');
          },
        });
        onCleanup(() => subscription.unsubscribe());
      } else {
        this.studentNameSignal.set('Unknown Student');
      }
    });
  }

  onGrade(): void {
    this.gradeAssignment.emit();
  }

  downloadSubmission() {
    const solutionId = this.solution().id;
    if (!solutionId) {
      this.snackBar.open('Solution ID not found.', 'Close', { duration: 3000 });
      return;
    }
    this.isDownloading.set(true);
    this.assignmentSolutionService.downloadAssignmentSolution(solutionId).subscribe({
      next: (response) => {
        this.handleDownloadSuccess(response);
      },
      error: () => {
        this.handleDownloadError();
      },
      complete: () => {
        this.isDownloading.set(false);
      },
    });
  }

  private handleDownloadSuccess(response: Blob) {
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.fileName() || 'assignment-solution';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private handleDownloadError() {
    this.snackBar.open('Failed to download solution. Please try again.', 'Close', { duration: 3000 });
  }
}
