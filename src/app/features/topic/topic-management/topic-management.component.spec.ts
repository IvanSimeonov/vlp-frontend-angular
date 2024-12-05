import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicManagementComponent } from './topic-management.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TopicStateService } from '../../../services/topic/topic-state.service';

describe('TopicManagementComponent', () => {
  let component: TopicManagementComponent;
  let fixture: ComponentFixture<TopicManagementComponent>;
  const topicStateServiceMock: jasmine.SpyObj<TopicStateService> = jasmine.createSpyObj('TopicStateService', [
    'getAllTopics',
    'addTopic',
    'updateTopic',
    'deleteTopic',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicManagementComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        {
          provide: TopicStateService,
          useValue: topicStateServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
