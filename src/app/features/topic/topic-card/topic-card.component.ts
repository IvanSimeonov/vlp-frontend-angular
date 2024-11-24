import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITopic } from '../topic-management/topic-management.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss',
})
export class TopicCardComponent {
  @Input() topic: ITopic = {};
  @Output() edit = new EventEmitter<ITopic>();

  isCourseAssigned() {
    if (this.topic && this.topic.totalCourses) {
      return this.topic.totalCourses > 0;
    }
    return false;
  }
}
