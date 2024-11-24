import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicCreateEditDialogComponent } from './topic-create-edit-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TopicCreateEditDialogComponent', () => {
  let component: TopicCreateEditDialogComponent;
  let fixture: ComponentFixture<TopicCreateEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicCreateEditDialogComponent],
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

    fixture = TestBed.createComponent(TopicCreateEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
