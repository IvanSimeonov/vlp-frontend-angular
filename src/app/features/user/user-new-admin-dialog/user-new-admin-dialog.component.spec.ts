import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewAdminDialogComponent } from './user-new-admin-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserNewAdminDialogComponent', () => {
  let component: UserNewAdminDialogComponent;
  let fixture: ComponentFixture<UserNewAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNewAdminDialogComponent],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserNewAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
