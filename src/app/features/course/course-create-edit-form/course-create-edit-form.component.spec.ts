import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateEditFormComponent } from './course-create-edit-form.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CourseCreateEditFormComponent', () => {
  let component: CourseCreateEditFormComponent;
  let fixture: ComponentFixture<CourseCreateEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateEditFormComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCreateEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
