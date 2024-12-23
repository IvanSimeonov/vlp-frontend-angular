import { Component, inject, Input, OnInit } from '@angular/core';
import { AssignmentSolutionFilterComponent } from '../assignment-solution-filter/assignment-solution-filter.component';
import { AssignmentSolutionCardComponent } from '../assignment-solution-card/assignment-solution-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssignmentSolutionGradeDialogComponent } from '../assignment-solution-grade-dialog/assignment-solution-grade-dialog.component';
import { AssignmentSolutionControllerService, AssignmentSolutionDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-assignment-solution-list',
  standalone: true,
  imports: [AssignmentSolutionFilterComponent, AssignmentSolutionCardComponent, MatPaginatorModule, MatDialogModule],
  templateUrl: './assignment-solution-list.component.html',
  styleUrl: './assignment-solution-list.component.scss',
})
export class AssignmentSolutionListComponent implements OnInit {
  private assignmentService = inject(AssignmentSolutionControllerService);
  readonly dialog = inject(MatDialog);
  @Input() assignmentSolutions: AssignmentSolutionDto[] | undefined;
  @Input() isTeacher = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit(): void {
    console.log('Assignment Solutions Length: ', this.assignmentSolutions?.length);
  }

  onPaginate(event: PageEvent) {
    console.log('Page Event: ', event);
  }

  handleGrade(assignmentSolution: AssignmentSolutionDto): void {
    const dialogRef = this.dialog.open(AssignmentSolutionGradeDialogComponent, {
      data: { assignmentSolution },
    });

    dialogRef.afterClosed().subscribe((score) => {
      if (score) {
        console.log('AS-LIST-SCORE: ', score);
        console.log('AS-LIST-SCORE: ', assignmentSolution.id);
        this.assignmentService.updateGradeSolution(1, assignmentSolution.id!, score).subscribe({
          next: (result) => console.log('After grade: ', result),
          error: (err) => console.error('Error grading: ', err),
        });
      }
    });
  }
}
