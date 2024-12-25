import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AssignmentSolutionCardComponent } from '../assignment-solution-card/assignment-solution-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssignmentSolutionGradeDialogComponent } from '../assignment-solution-grade-dialog/assignment-solution-grade-dialog.component';
import { AssignmentSolutionControllerService, AssignmentSolutionDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-assignment-solution-list',
  standalone: true,
  imports: [AssignmentSolutionCardComponent, MatPaginatorModule, MatDialogModule],
  templateUrl: './assignment-solution-list.component.html',
  styleUrl: './assignment-solution-list.component.scss',
})
export class AssignmentSolutionListComponent {
  private assignmentService = inject(AssignmentSolutionControllerService);
  private readonly dialog = inject(MatDialog);

  readonly isLoading = signal(false);
  readonly pageSize = signal(10);
  readonly pageNumber = signal(0);

  assignmentSolutions = input<AssignmentSolutionDto[]>([]);
  isTeacher = input(false);
  totalSolutions = computed(() => this.assignmentSolutions().length);

  gradeUpdated = output();

  handlePageEvent(event: PageEvent) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  handleGrade(assignmentSolution: AssignmentSolutionDto): void {
    const dialogRef = this.dialog.open(AssignmentSolutionGradeDialogComponent, {
      data: { assignmentSolution },
    });

    dialogRef.afterClosed().subscribe((grade) => {
      if (grade) {
        this.isLoading.set(true);
        this.assignmentService.updateGradeSolution(1, assignmentSolution.id!, grade).subscribe({
          next: () => {
            this.gradeUpdated.emit();
          },
          error: (err) => {
            console.error('Error grading: ', err);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }
}
