import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicManagementComponent } from './topic-management.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TopicManagementComponent', () => {
  let component: TopicManagementComponent;
  let fixture: ComponentFixture<TopicManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicManagementComponent],
      providers: [provideAnimations(), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
