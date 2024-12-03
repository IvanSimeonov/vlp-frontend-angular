import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureManagementComponent } from './lecture-management.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LectureManagementComponent', () => {
  let component: LectureManagementComponent;
  let fixture: ComponentFixture<LectureManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureManagementComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(LectureManagementComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('courseId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
