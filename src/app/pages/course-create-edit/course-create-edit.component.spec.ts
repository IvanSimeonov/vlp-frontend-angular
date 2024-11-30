import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateEditComponent } from './course-create-edit.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CourseCreateEditComponent', () => {
  let component: CourseCreateEditComponent;
  let fixture: ComponentFixture<CourseCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateEditComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
