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
import { TopicCreateDto, TopicOverviewDto, TopicUpdateDto } from '@ivannicksim/vlp-backend-openapi-client';
import { TopicStateService } from '../../../services/topic/topic-state.service';
import { BehaviorSubject, debounceTime } from 'rxjs';

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
  private topicStateService = inject(TopicStateService);
  private searchSubject = new BehaviorSubject<string>('');

  topics$ = this.topicStateService.topics$;
  totalTopics$ = this.topicStateService.totalTopics$;
  isLoading = signal(false);

  pageNumber = signal(0);
  pageSize = signal(5);
  sortBy = signal('title');
  sortDirection = signal('asc');
  searchTerm = signal('');

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => this.fetchTopics());
    this.fetchTopics();
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
        if (result) {
          this.topicStateService.updateTopic(result);
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
        if (result) {
          this.topicStateService.addTopic(result);
        }
      });
  }

  deleteTopic(topicId: number) {
    this.topicStateService.deleteTopic(topicId);
  }

  fetchTopics(): void {
    console.log('Fetch');
    this.isLoading.set(true);
    this.topicStateService.getAllTopics(
      this.pageNumber(),
      this.pageSize(),
      this.sortBy(),
      this.sortDirection(),
      this.searchTerm()
    );
    this.isLoading.set(false);
  }

  onPageChange(event: PageEvent): void {
    console.log('PAge event: ', event);
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchTopics();
  }

  onSortChange(event: MatSelectChange): void {
    const [sortBy, sortDirection] = event.value.split(':');
    this.sortBy.set(sortBy);
    this.sortDirection.set(sortDirection);
    this.fetchTopics();
  }

  onSearchChange(): void {
    console.log('Search changed');
    this.pageNumber.set(0);
    this.searchSubject.next(this.searchTerm());
  }
}
