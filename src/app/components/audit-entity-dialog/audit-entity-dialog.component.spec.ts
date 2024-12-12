import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEntityDialogComponent } from './audit-entity-dialog.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

describe('AuditEntityDialogComponent', () => {
  let component: AuditEntityDialogComponent;
  let fixture: ComponentFixture<AuditEntityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAnimations(), { provide: MAT_DIALOG_DATA, useValue: [] }],
      imports: [
        AuditEntityDialogComponent,
        NoopAnimationsModule,
        CommonModule,
        MatDialogModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuditEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
