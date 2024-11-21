import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  roles = ['ROOT_ADMIN', 'Admin', 'Teacher', 'Student'];
  statuses = ['Active', 'Inactive'];

  dialogRef = inject(MatDialogRef<UserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  isEditable = false;

  constructor() {
    this.isEditable = this.data.currentUserRole === 'ROOT_ADMIN' || this.data.role !== 'Admin';
  }

  save(): void {
    console.log('Saved data:', this.data);
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
