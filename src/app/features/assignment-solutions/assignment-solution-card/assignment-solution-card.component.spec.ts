import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionCardComponent } from './assignment-solution-card.component';

describe('AssignmentSolutionCardComponent', () => {
  let component: AssignmentSolutionCardComponent;
  let fixture: ComponentFixture<AssignmentSolutionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentSolutionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
