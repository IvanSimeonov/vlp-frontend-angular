import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseManagementComponent } from './course-management.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CourseManagementComponent', () => {
  let component: CourseManagementComponent;
  let fixture: ComponentFixture<CourseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseManagementComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
