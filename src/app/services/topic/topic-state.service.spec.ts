import { TestBed } from '@angular/core/testing';

import { TopicStateService } from './topic-state.service';
import { provideHttpClient } from '@angular/common/http';
import { TopicControllerService } from '@ivannicksim/vlp-backend-openapi-client';

describe('TopicStateService', () => {
  let service: TopicStateService;
  const topicControllerServiceMock: jasmine.SpyObj<TopicControllerService> = jasmine.createSpyObj(
    'TopicControllerService',
    ['createTopic', 'deleteTopicById', 'getAllTopics', 'getTopicById', 'updateTopic']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: TopicControllerService,
          useValue: topicControllerServiceMock,
        },
      ],
    });
    service = TestBed.inject(TopicStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
