import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfileComponent } from './user-edit-profile.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('UserEditProfileComponent', () => {
  let component: UserEditProfileComponent;
  let fixture: ComponentFixture<UserEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditProfileComponent],
      providers: [provideAnimations(), provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
