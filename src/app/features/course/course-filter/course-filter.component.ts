import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CourseSearchCriteriaDto, TopicAnalyticsDto } from '@ivannicksim/vlp-backend-openapi-client';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';

@Component({
  selector: 'app-course-filter',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './course-filter.component.html',
  styleUrl: './course-filter.component.scss',
})
export class CourseFilterComponent implements OnInit {
  private fb = inject(FormBuilder);

  topics = input<TopicAnalyticsDto[]>([]);
  isManagement = input<boolean>(false);
  filterChange = output<{
    title: '';
    author: '';
    topic: string | undefined;
    difficulty: CourseSearchCriteriaDto.DifficultyLevelEnum | undefined;
    status: CourseSearchCriteriaDto.StatusEnum | undefined;
  }>();

  filterForm: FormGroup = this.fb.group({
    title: [''],
    author: [''],
    topic: [''],
    difficulty: [''],
    status: [''],
  });

  difficultyLevels = Object.values(CourseSearchCriteriaDto.DifficultyLevelEnum);
  statuses = Object.values(CourseSearchCriteriaDto.StatusEnum);

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filters) => {
      this.filterChange.emit({
        title: filters.title ? filters.title.trim() : '',
        author: filters.author ? filters.author.trim() : '',
        topic: filters.topic,
        difficulty: filters.difficulty !== '' ? filters.difficulty : undefined,
        status: filters.status !== '' ? filters.status : undefined,
      });
    });
  }

  onReset(): void {
    this.filterForm.reset({
      title: '',
      author: '',
      topic: '',
      difficulty: '',
      status: '',
    });
  }

  formatDifficultyLevel(difficulyLevel: CourseSearchCriteriaDto.DifficultyLevelEnum): string {
    return EnumUtils.formatDifficultyLevel(difficulyLevel);
  }

  formatStatus(status: CourseSearchCriteriaDto.StatusEnum): string {
    return EnumUtils.formatStatus(status);
  }
}
