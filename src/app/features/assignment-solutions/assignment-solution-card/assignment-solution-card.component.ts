import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IAssignmentSolution } from '../../../pages/course-details/course-details.component';

@Component({
  selector: 'app-assignment-solution-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './assignment-solution-card.component.html',
  styleUrl: './assignment-solution-card.component.scss',
})
export class AssignmentSolutionCardComponent {
  @Input() assignmentSolution!: IAssignmentSolution;
  @Input() isTeacher = true;
  @Output() gradeAssignment = new EventEmitter<void>();

  onGrade(): void {
    this.gradeAssignment.emit();
  }
}
