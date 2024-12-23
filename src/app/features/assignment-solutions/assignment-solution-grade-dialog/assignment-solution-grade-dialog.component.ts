import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AssignmentSolutionDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-assignment-solution-grade-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './assignment-solution-grade-dialog.component.html',
  styleUrl: './assignment-solution-grade-dialog.component.scss',
})
export class AssignmentSolutionGradeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AssignmentSolutionGradeDialogComponent>);
  readonly data = inject<AssignmentSolutionDto>(MAT_DIALOG_DATA);
  readonly grade = model(this.data.grade);
}
