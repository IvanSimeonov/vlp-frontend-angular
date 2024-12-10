import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AdminControllerService,
  UserOverviewDto,
  UserSearchCriteriaDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
export class UserDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);
  private data: number = inject(MAT_DIALOG_DATA);
  private adminService = inject(AdminControllerService);
  private fb = inject(FormBuilder);

  user = signal<UserOverviewDto | undefined>(undefined);
  isEditable = computed(() => this.user()?.role !== 'ROLE_ADMIN' && this.user()?.role !== 'ROLE_ROOT_ADMIN');
  roles = Object.values(UserSearchCriteriaDto.RoleTypeEnum);
  statuses = [true, false];
  userAccessForm: FormGroup = this.fb.group({
    role: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    this.fetchUser();
  }

  save(): void {
    if (this.userAccessForm.valid) {
      this.updateUser(this.data);
    }
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private fetchUser() {
    this.adminService.getUser(this.data).subscribe({
      next: (res: UserOverviewDto) => {
        console.log(res);
        this.user.set(res);
        this.userAccessForm.patchValue({
          role: res.role,
          status: res.enabled,
        });
        if (!this.isEditable()) {
          this.userAccessForm.get('role')?.disable();
          this.userAccessForm.get('status')?.disable();
        } else {
          this.userAccessForm.get('role')?.enable();
          this.userAccessForm.get('status')?.enable();
        }
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  formatRole(role: UserSearchCriteriaDto.RoleTypeEnum) {
    return EnumUtils.formatUserRole(role);
  }

  formatStatus(status: boolean) {
    return EnumUtils.formatUserStatus(status);
  }

  private updateUser(userId: number) {
    this.adminService
      .updateUserAccess(userId, {
        roleType: this.userAccessForm.value.role,
        enabled: this.userAccessForm.value.status,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error('Error: ', err);
        },
      });
  }
}
