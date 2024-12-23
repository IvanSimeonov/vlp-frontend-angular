import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSolutionListComponent } from './assignment-solution-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AssignmentSolutionListComponent', () => {
  let component: AssignmentSolutionListComponent;
  let fixture: ComponentFixture<AssignmentSolutionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSolutionListComponent],
      providers: [provideAnimations(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentSolutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
