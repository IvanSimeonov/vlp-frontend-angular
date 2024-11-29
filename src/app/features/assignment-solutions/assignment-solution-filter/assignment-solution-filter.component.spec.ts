import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionFilterComponent } from './assignment-solution-filter.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AssignmentSolutionFilterComponent', () => {
  let component: AssignmentSolutionFilterComponent;
  let fixture: ComponentFixture<AssignmentSolutionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionFilterComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentSolutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
