import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionListComponent } from './assignment-solution-list.component';

describe('AssignmentSolutionListComponent', () => {
  let component: AssignmentSolutionListComponent;
  let fixture: ComponentFixture<AssignmentSolutionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentSolutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
