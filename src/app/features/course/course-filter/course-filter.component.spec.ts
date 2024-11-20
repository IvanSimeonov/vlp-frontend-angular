import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFilterComponent } from './course-filter.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CourseFilterComponent', () => {
  let component: CourseFilterComponent;
  let fixture: ComponentFixture<CourseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFilterComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
