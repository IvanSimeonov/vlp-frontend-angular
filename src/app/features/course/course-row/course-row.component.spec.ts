import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRowComponent } from './course-row.component';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

describe('CourseRowComponent', () => {
  let component: CourseRowComponent;
  let fixture: ComponentFixture<CourseRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      imports: [CourseRowComponent, MatDialogModule],
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
