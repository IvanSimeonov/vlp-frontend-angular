import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialogComponent } from './user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: [],
        },
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
