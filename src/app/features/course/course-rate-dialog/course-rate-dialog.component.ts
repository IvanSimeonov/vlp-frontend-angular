import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../course-card/course-card.component';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { MatButtonModule } from '@angular/material/button';

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
    @Inject(MAT_DIALOG_DATA) public data: { course: ICourse }
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
