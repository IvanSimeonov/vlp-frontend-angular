import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TopicAnalyticsDto } from '@ivannicksim/vlp-backend-openapi-client';

export interface IFilterOption {
  id: string;
  label: string;
  options?: string[];
}

export interface ISortOption {
  id: string;
  label: string;
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
    ReactiveFormsModule,
  ],
  templateUrl: './course-filter-bar.component.html',
  styleUrl: './course-filter-bar.component.scss',
})
export class CourseFilterBarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @Input() topics: TopicAnalyticsDto[] = [];
  @Input() filters: IFilterOption[] = [];
  @Input() sortOptions: ISortOption[] = [];
  @Input() isUserTeacher = false;
  @Output() filterChange = new EventEmitter<{ title: string; topic: string | undefined }>();
  @Output() sortChange = new EventEmitter<MatSelectChange>();
  @Output() resetFilters = new EventEmitter<void>();

  filterForm: FormGroup = this.fb.group({
    title: [''],
    topic: [''],
    sort: ['title:asc'],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filters) => {
      this.filterChange.emit({
        title: filters.title,
        topic: filters.topic,
      });
    });
  }

  navigateToCourseCreation() {
    this.router.navigate(['/courses/create']);
  }

  onSortChange(event: MatSelectChange) {
    this.sortChange.emit(event);
  }

  resetFiltersAndSorting() {
    this.filterForm.patchValue({
      title: '',
      topic: '',
      sort: 'title:asc',
    });

    const resetSortEvent = {
      value: 'title:asc',
    } as MatSelectChange;

    this.sortChange.emit(resetSortEvent);
    this.filterChange.emit({
      title: '',
      topic: '',
    });
  }
}
