import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateEditComponent } from './course-create-edit.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('CourseCreateEditComponent', () => {
  let component: CourseCreateEditComponent;
  let fixture: ComponentFixture<CourseCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateEditComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { editMode: false },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
