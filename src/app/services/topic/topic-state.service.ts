import { inject, Injectable } from '@angular/core';
import {
  TopicControllerService,
  TopicCreateDto,
  TopicOverviewDto,
  TopicUpdateDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopicStateService {
  private topicsService = inject(TopicControllerService);
  private topicsSubject = new BehaviorSubject<TopicOverviewDto[]>([]);
  private totalTopicsSubject = new BehaviorSubject<number>(0);

  topics$ = this.topicsSubject.asObservable();
  totalTopics$ = this.totalTopicsSubject.asObservable();

  getAllTopics(pageNumber: number, pageSize: number, sortBy: string, sortDirection: string, searchTerm: string): void {
    this.topicsService.getAllTopics(pageNumber, pageSize, sortBy, sortDirection, searchTerm).subscribe({
      next: (topics) => {
        console.log(topics);
        this.topicsSubject.next(topics.content!);
        this.totalTopicsSubject.next(topics.totalElements || 0);
      },
      error: (err) => console.error('Error fetching topics: ', err),
    });
  }

  addTopic(newTopic: TopicCreateDto): void {
    this.topicsService.createTopic(newTopic).subscribe({
      next: (response) => {
        console.log(response);
        const currentTopics = this.topicsSubject.getValue();
        this.topicsSubject.next([...currentTopics, newTopic]);
      },
      error: (err) => console.error('Error creating topic: ', err),
    });
  }

  updateTopic(updatedTopic: TopicUpdateDto): void {
    this.topicsService.updateTopic(updatedTopic.id, updatedTopic).subscribe({
      next: () => {
        const currentTopics = this.topicsSubject.getValue();
        const updatedTopics = currentTopics.map((topic) =>
          topic.id === updatedTopic.id ? { ...topic, ...updatedTopic } : topic
        );
        this.topicsSubject.next(updatedTopics);
      },
      error: (err) => console.error('Error updating topic: ', err),
    });
  }

  deleteTopic(topicId: number): void {
    this.topicsService.deleteTopicById(topicId).subscribe({
      next: () => {
        const currentTopics = this.topicsSubject.getValue();
        const filteredTopics = currentTopics.filter((t) => t.id !== topicId);
        this.topicsSubject.next(filteredTopics);
      },
      error: (err) => console.error('Error delete a topic: ', err),
    });
  }
}
