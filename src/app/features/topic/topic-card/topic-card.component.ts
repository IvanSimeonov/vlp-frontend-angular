import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TopicOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss',
})
export class TopicCardComponent {
  topic = input.required<TopicOverviewDto>();
  edit = output<TopicOverviewDto>();
  delete = output<number>();

  isCourseAssigned = computed(() => (this.topic()?.coursesAmount ?? 0) > 0);

  onEdit() {
    this.edit.emit(this.topic());
  }

  onDelete() {
    if (this.topic()?.id) {
      this.delete.emit(this.topic().id!);
    }
  }
}
