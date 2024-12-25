import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsComponent } from './course-details.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpEvent, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CourseControllerService, CourseDetailsDto } from '@ivannicksim/vlp-backend-openapi-client';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseControllerService>;

  const courseDetailsMock: CourseDetailsDto = {
    id: 1,
    title: 'Course Title Test',
  };

  beforeEach(async () => {
    courseServiceSpy = jasmine.createSpyObj('CourseControllerService', ['getCourseDetailsById']);
    courseServiceSpy.getCourseDetailsById.and.returnValue(
      of({ body: courseDetailsMock } as HttpEvent<CourseDetailsDto>)
    );
    await TestBed.configureTestingModule({
      imports: [CourseDetailsComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
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
          useValue: courseServiceSpy,
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
