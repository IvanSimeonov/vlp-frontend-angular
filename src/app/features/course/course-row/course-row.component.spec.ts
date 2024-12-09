import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRowComponent } from './course-row.component';

describe('CourseRowComponent', () => {
  let component: CourseRowComponent;
  let fixture: ComponentFixture<CourseRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('course', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
