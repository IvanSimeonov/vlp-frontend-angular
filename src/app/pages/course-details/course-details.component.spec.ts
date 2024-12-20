import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsComponent } from './course-details.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CourseControllerService } from '@ivannicksim/vlp-backend-openapi-client';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;
  const courseServiceMock: jasmine.SpyObj<CourseControllerService> = jasmine.createSpyObj('CourseService', [
    'getCourseDetailsById',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailsComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1';
                  return null;
                },
              },
            },
            params: of({
              id: 1,
            }),
          },
        },
        {
          provide: CourseControllerService,
          useValue: courseServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
