import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicProfileComponent } from './user-public-profile.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserPublicProfileComponent', () => {
  let component: UserPublicProfileComponent;
  let fixture: ComponentFixture<UserPublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPublicProfileComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
