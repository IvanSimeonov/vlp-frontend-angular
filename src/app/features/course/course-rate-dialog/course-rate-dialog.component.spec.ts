import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRateDialogComponent } from './course-rate-dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CourseRateDialogComponent', () => {
  let component: CourseRateDialogComponent;
  let fixture: ComponentFixture<CourseRateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRateDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: [],
        },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
