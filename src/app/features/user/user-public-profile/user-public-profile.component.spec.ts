import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicProfileComponent } from './user-public-profile.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserPublicProfileComponent', () => {
  let component: UserPublicProfileComponent;
  let fixture: ComponentFixture<UserPublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPublicProfileComponent],
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
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
