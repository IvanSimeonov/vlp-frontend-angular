import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRateDialogComponent } from './course-rate-dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';

describe('CourseRateDialogComponent', () => {
  let component: CourseRateDialogComponent;
  let fixture: ComponentFixture<CourseRateDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CourseRateDialogComponent>>;

  const mockCourse: CourseOverviewDto = {
    id: 1,
    title: 'Test Course Title',
    shortDescription: 'Test Course Short Desc',
    averageRating: 4.5,
    totalRatings: 10,
    status: CourseOverviewDto.StatusEnum.Published,
    difficultyLevel: CourseOverviewDto.DifficultyLevelEnum.Advanced,
  };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [CourseRateDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { course: mockCourse },
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
