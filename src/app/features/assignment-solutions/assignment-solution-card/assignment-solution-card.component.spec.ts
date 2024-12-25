import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionCardComponent } from './assignment-solution-card.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

describe('AssignmentSolutionCardComponent', () => {
  let component: AssignmentSolutionCardComponent;
  let fixture: ComponentFixture<AssignmentSolutionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionCardComponent],
      providers: [provideAnimations(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentSolutionCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('solution', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
