import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentSolutionControllerService, AssignmentSolutionDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-assignment-solution-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './assignment-solution-card.component.html',
  styleUrl: './assignment-solution-card.component.scss',
})
export class AssignmentSolutionCardComponent {
  private assignmentSolutionService = inject(AssignmentSolutionControllerService);
  @Input() assignmentSolution!: AssignmentSolutionDto;
  @Input() isTeacher = true;
  @Output() gradeAssignment = new EventEmitter<void>();

  onGrade(): void {
    this.gradeAssignment.emit();
  }

  downloadSubmission() {
    const solutionId = this.assignmentSolution.id;
    if (solutionId) {
      this.assignmentSolutionService.downloadAssignmentSolution(solutionId).subscribe({
        next: (res) => {
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.getAssignmentSolutionFileName();
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading assignment solution', error);
        },
      });
    }
  }

  getAssignmentSolutionFileName() {
    const solution = this.assignmentSolution;
    if (!solution?.submissionFilePath) {
      return '';
    }
    return solution?.submissionFilePath.split('/').pop() || 'Assignment Solution';
  }
}
