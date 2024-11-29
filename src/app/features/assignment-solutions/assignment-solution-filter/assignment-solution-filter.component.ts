import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-assignment-solution-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './assignment-solution-filter.component.html',
  styleUrl: './assignment-solution-filter.component.scss',
})
export class AssignmentSolutionFilterComponent {
  @Output() search = new EventEmitter<string>();
  @Output() resetFilters = new EventEmitter<void>();
  searchQuery = '';

  onSearchInput(): void {
    this.search.emit(this.searchQuery);
  }

  onResetFilters() {
    this.searchQuery = '';
    this.search.emit(this.searchQuery);
    this.resetFilters.emit();
  }
}
