import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TopicCardComponent } from '../topic-card/topic-card.component';
import { TopicCreateEditDialogComponent } from '../topic-create-edit-dialog/topic-create-edit-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  TopicControllerService,
  TopicCreateDto,
  TopicOverviewDto,
  TopicUpdateDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { debounceTime, delay, Subject } from 'rxjs';

@Component({
  selector: 'app-topic-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TopicCardComponent,
  ],
  templateUrl: './topic-management.component.html',
  styleUrl: './topic-management.component.scss',
})
export class TopicManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private topicService = inject(TopicControllerService);
  private searchSubject = new Subject<string>();

  topics = signal<TopicOverviewDto[]>([]);
  totalTopics = signal<number>(0);
  isLoading = signal<boolean>(false);
  searchTerm = '';
  paginationSortingFiltering = signal({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'title',
    sortDirection: 'asc',
    searchTerm: '',
  });

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
    this.fetchTopics();
  }

  fetchTopics(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTerm } = this.paginationSortingFiltering();
    this.topicService
      .getAllTopics(pageNumber, pageSize, sortBy, sortDirection, searchTerm)
      .pipe(delay(300))
      .subscribe({
        next: (res) => {
          this.topics.set(res.content || []);
          this.totalTopics.set(res.totalElements || 0);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading.set(false);
        },
      });
  }

  openEditDialog(topic: TopicOverviewDto) {
    this.dialog
      .open(TopicCreateEditDialogComponent, {
        data: topic,
        width: '20vw',
        minHeight: '30vh',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '100ms',
      })
      .afterClosed()
      .subscribe((result: TopicUpdateDto) => {
        this.isLoading.set(true);
        if (result) {
          this.topicService
            .updateTopic(result.id, result)
            .pipe(delay(300))
            .subscribe({
              next: () => this.handleRequestSuccess(),
              error: (err) => this.handleRequestError(err),
            });
        } else {
          this.isLoading.set(false);
        }
      });
  }

  openCreateDialog() {
    this.dialog
      .open(TopicCreateEditDialogComponent, {
        data: null,
        width: '20vw',
        minHeight: '30vh',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '100ms',
      })
      .afterClosed()
      .subscribe((result: TopicCreateDto) => {
        this.isLoading.set(true);
        if (result) {
          this.topicService
            .createTopic(result)
            .pipe(delay(300))
            .subscribe({
              next: () => this.handleRequestSuccess(),
              error: (err) => this.handleRequestError(err),
            });
        } else {
          this.isLoading.set(false);
        }
      });
  }

  deleteTopic(topicId: number) {
    this.isLoading.set(true);
    this.topicService
      .deleteTopicById(topicId)
      .pipe(delay(300))
      .subscribe({
        next: () => this.handleRequestSuccess(),
        error: (err) => this.handleRequestError(err),
      });
  }

  onPageChange(event: PageEvent): void {
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchTopics();
  }

  onSortChange(event: MatSelectChange): void {
    const [sortBy, sortDirection] = event.value.split(':');
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: sortBy,
      sortDirection: sortDirection,
    }));
    this.fetchTopics();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  private performSearch(searchTerm: string) {
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      searchTerm,
      pageNumber: 0,
    }));
    this.fetchTopics();
  }

  private handleRequestSuccess() {
    this.isLoading.set(false);
    this.fetchTopics();
  }

  private handleRequestError(err: Error) {
    this.isLoading.set(false);
    console.error('Error: ', err);
  }
}
