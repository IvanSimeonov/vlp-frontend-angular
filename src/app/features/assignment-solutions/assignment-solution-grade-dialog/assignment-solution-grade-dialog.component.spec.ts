import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionGradeDialogComponent } from './assignment-solution-grade-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AssignmentSolutionGradeDialogComponent', () => {
  let component: AssignmentSolutionGradeDialogComponent;
  let fixture: ComponentFixture<AssignmentSolutionGradeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionGradeDialogComponent],
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

    fixture = TestBed.createComponent(AssignmentSolutionGradeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
