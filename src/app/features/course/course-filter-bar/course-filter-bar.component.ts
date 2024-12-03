import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

export interface IFilterOption {
  id: string;
  label: string;
  options?: string[];
}

@Component({
  selector: 'app-course-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './course-filter-bar.component.html',
  styleUrl: './course-filter-bar.component.scss',
})
export class CourseFilterBarComponent {
  @Input() filters: IFilterOption[] = [];
  @Input() sortOptions: { id: string; label: string }[] = [];
  @Input() isUserCourseOwner = false;
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<Record<string, string>>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() resetFilters = new EventEmitter<void>();

  searchQuery = '';
  activeFilters: Record<string, string> = {};

  constructor(private router: Router) {}

  navigateToCourseCreation() {
    this.router.navigate(['/courses/create']);
  }

  onSearchInput(): void {
    this.search.emit(this.searchQuery);
  }

  onFilterChange(filterId: string, value: string): void {
    this.activeFilters[filterId] = value;
    this.filterChange.emit({ ...this.activeFilters });
  }

  onSortChange(sortId: string) {
    this.sortChange.emit(sortId);
  }

  resetFiltersAndSorting() {
    this.searchQuery = '';
    this.search.emit(this.searchQuery);
    this.activeFilters = {};
    this.filterChange.emit(this.activeFilters);
    this.resetFilters.emit();
  }
}
