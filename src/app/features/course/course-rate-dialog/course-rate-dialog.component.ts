import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { CourseOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-course-rate-dialog',
  standalone: true,
  imports: [StarRatingComponent, MatDialogModule, MatButtonModule],
  templateUrl: './course-rate-dialog.component.html',
  styleUrl: './course-rate-dialog.component.scss',
})
export class CourseRateDialogComponent {
  selectedRating = 0;

  constructor(
    private dialogRef: MatDialogRef<CourseRateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseOverviewDto }
  ) {}

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close(this.selectedRating);
  }
}
