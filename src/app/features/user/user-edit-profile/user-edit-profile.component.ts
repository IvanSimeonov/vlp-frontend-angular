import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { FileUploadComponent } from '../../../components/file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Editor, NgxEditorModule, schema, Toolbar } from 'ngx-editor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay, merge } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {
  AdminControllerService,
  UserControllerService,
  UserOverviewDto,
  UserPublicProfileDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserProfileService } from '../../../services/user/user-profile.service';

@Component({
  selector: 'app-user-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxEditorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-edit-profile.component.html',
  styleUrl: './user-edit-profile.component.scss',
})
export class UserEditProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private userService = inject(UserControllerService);
  private adminService = inject(AdminControllerService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  accordion = viewChild.required(MatAccordion);
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  maxFileSizeMB = 10;
  isAccessRequested = signal(false);
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  html = '';

  userId = computed(() => this.userProfileService.userProfile()?.id);
  user = signal<UserPublicProfileDto | null>(null);
  userProfileImage = signal<Blob | string | undefined>(undefined);
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideRetypeNewPassword = signal(true);
  firstNameErrorMsg = signal('');
  lastNameErrorMsg = signal('');
  imageErrorMsg = signal('');
  passwordErrorMsg = signal('');
  newPasswordErrorMsg = signal('');
  retypeNewPasswordErrorMsg = signal('');
  wrongPasswordErrorMsg = signal('');
  isSaving = signal(false);

  updatePersonalDataForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    linkedInProfile: [''],
    about: [''],
  });

  updateSecurityDataForm = this.formBuilder.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    retypeNewPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  constructor() {
    this.initErrorSubscriptionsPersonalData();
    this.initErrorSubscriptionsSecurityData();
    this.updateSecurityDataForm.addValidators(passwordCompareValidator);
  }

  ngOnInit(): void {
    this.editor = new Editor({
      content: '',
      plugins: [],
      schema,
      nodeViews: {},
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
    });
    const id = this.userId();
    if (id) {
      this.loadUserProfile(id);
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  navigateToPublicProfile() {
    const userId = this.userId();
    if (userId) {
      this.router.navigate([`user/${userId}/profile`]);
    }
  }

  onRequestTeacherAccess() {
    this.isAccessRequested.set(true);
    this.isSaving.set(true);
    this.userService.requestTeacherAccess().subscribe({
      next: () => {
        this.snackBar.open('Teacher access request sent successfully', 'Close', { duration: 3000 });
        this.loadUserProfile(this.userId()!);
      },
      error: () => {
        this.snackBar.open('Failed to sent teacher access request', 'Close', { duration: 3000 });
        this.isSaving.set(false);
      },
    });
  }

  logout() {
    this.authService.clearTokens();
    this.router.navigateByUrl('/');
  }

  onPersonalDataUpdate() {
    if (this.updatePersonalDataForm.valid) {
      this.isSaving.set(true);
      this.adminService
        .updateUserProfile(this.userId()!, {
          firstName: this.updatePersonalDataForm.controls.firstName.value,
          lastName: this.updatePersonalDataForm.controls.lastName.value,
          linkedInProfileUrl: this.updatePersonalDataForm.controls.linkedInProfile.value,
          bio: this.updatePersonalDataForm.controls.about.value,
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Profile data updated successfully', 'Close', { duration: 3000 });
            this.loadUserProfile(this.userId()!);
          },
          error: () => {
            this.snackBar.open('Failed to updated profile data', 'Close', { duration: 3000 });
            this.isSaving.set(false);
          },
        });
    }
  }

  onImageUpload(file: File): void {
    this.isSaving.set(true);
    this.adminService.updateUserAvatar(this.userId()!, file).subscribe({
      next: () => {
        this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
        this.loadUserProfile(this.userId()!);
      },
      error: () => {
        this.snackBar.open('Failed to upload image', 'Close', { duration: 3000 });
        this.isSaving.set(false);
      },
    });
  }

  onChangePassword() {
    if (this.updateSecurityDataForm.valid) {
      this.isSaving.set(true);
      this.adminService
        .changePassword(this.userId()!, {
          currentPassword: this.updateSecurityDataForm.controls.currentPassword.value,
          newPassword: this.updateSecurityDataForm.controls.newPassword.value,
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
            this.loadUserProfile(this.userId()!);
          },
          error: () => {
            this.snackBar.open('Failed to change password. Please, try again!', 'Close', { duration: 3000 });
            this.isSaving.set(false);
          },
        });
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hideCurrentPassword.update((hide) => !hide);
    event.stopPropagation();
  }

  toggleNewPasswordVisibility(event: MouseEvent) {
    this.hideNewPassword.update((hide) => !hide);
    event.stopPropagation();
  }

  toggleRetypeNewPasswordVisibility(event: MouseEvent) {
    this.hideRetypeNewPassword.update((hide) => !hide);
    event.stopPropagation();
  }

  markAsPersonalDataFormTouched(controlName: string): void {
    const control = this.updatePersonalDataForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  markAsSecurityDataFormTouched(controlName: string): void {
    const control = this.updateSecurityDataForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  isUserTeacherOrAdmin() {
    const role = this.user()?.role;
    return role
      ? [UserOverviewDto.RoleEnum.Admin, UserOverviewDto.RoleEnum.RootAdmin, UserOverviewDto.RoleEnum.Teacher].includes(
          role
        )
      : false;
  }

  formatRole(role: UserPublicProfileDto.RoleEnum | undefined) {
    return role ? EnumUtils.formatUserRole(role) : '';
  }

  private loadUserProfile(userId: number) {
    this.isSaving.set(true);
    this.userService
      .getUserPublicProfile(userId)
      .pipe(delay(300))
      .subscribe({
        next: (user: UserPublicProfileDto) => {
          this.isAccessRequested.set(user.isTeacherAccessRequested!);
          this.user.set(user);
          this.updatePersonalDataForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            linkedInProfile: user.linkedInProfileUrl,
            about: user.bio,
          });
          const imagePath = user.profileImagePath;
          if (imagePath) {
            this.loadUserProfileImage(imagePath);
          }
          this.isSaving.set(false);
        },
        error: () => {
          this.snackBar.open('Failed to load profile.', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        },
      });
  }

  private loadUserProfileImage(imagePath: string) {
    this.userService.getProfileImage(imagePath).subscribe({
      next: (img) => {
        const imageUrl = URL.createObjectURL(img);
        this.userProfileImage.set(imageUrl);
      },
      error: () => this.snackBar.open('Failed to load profile image.', 'Close', { duration: 3000 }),
    });
  }

  private initErrorSubscriptionsPersonalData(): void {
    const fields: { name: string; signal: WritableSignal<string>; messages: Record<string, string> }[] = [
      {
        name: 'firstName',
        signal: this.firstNameErrorMsg,
        messages: {
          required: 'Enter your first name',
          minlength: 'Enter a first name that is 2 to 30 characters long',
          maxlength: 'Enter a first name that is 2 to 30 characters long',
        },
      },
      {
        name: 'lastName',
        signal: this.lastNameErrorMsg,
        messages: {
          required: 'Enter your last name',
          minlength: 'Enter a last name that is 2 to 30 characters long',
          maxlength: 'Enter a last name that is 2 to 30 characters long',
        },
      },
    ];

    fields.forEach(({ name, signal, messages }) => {
      merge(this.updatePersonalDataForm.get(name)!.statusChanges, this.updatePersonalDataForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessagePersonalData(name, signal, messages));
    });
  }

  private updateErrorMessagePersonalData(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ) {
    const control = this.updatePersonalDataForm.get(controlName)!;
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }

  private initErrorSubscriptionsSecurityData(): void {
    const fields: { name: string; signal: WritableSignal<string>; messages: Record<string, string> }[] = [
      {
        name: 'currentPassword',
        signal: this.passwordErrorMsg,
        messages: {
          required: 'Enter your password',
          minlength: 'Enter a password that is 8 to 16 characters long',
          maxlength: 'Enter a password that is 8 to 16 characters long',
        },
      },
      {
        name: 'newPassword',
        signal: this.newPasswordErrorMsg,
        messages: {
          required: 'Enter your password',
          minlength: 'Enter a password that is 8 to 16 characters long',
          maxlength: 'Enter a password that is 8 to 16 characters long',
          matchError: 'Passwords do not match',
        },
      },
      {
        name: 'retypeNewPassword',
        signal: this.retypeNewPasswordErrorMsg,
        messages: {
          required: 'Enter your password',
          minlength: 'Enter a password that is 8 to 16 characters long',
          maxlength: 'Enter a password that is 8 to 16 characters long',
          matchError: 'Passwords do not match',
        },
      },
    ];

    fields.forEach(({ name, signal, messages }) => {
      merge(this.updateSecurityDataForm.get(name)!.statusChanges, this.updateSecurityDataForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessageSecurityData(name, signal, messages));
    });
  }

  private updateErrorMessageSecurityData(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ) {
    const control = this.updateSecurityDataForm.get(controlName)!;
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }
}

function passwordCompareValidator(group: AbstractControl) {
  const newPasswordControl = group.get('newPassword');
  const retypeNewPasswordControl = group.get('retypeNewPassword');
  if (!newPasswordControl || !retypeNewPasswordControl) {
    return null;
  }
  const newPassword = newPasswordControl.value;
  const retypeNewPassword = retypeNewPasswordControl.value;

  if (newPassword !== retypeNewPassword) {
    retypeNewPasswordControl.setErrors({ matchError: true });
    return { matchError: true };
  }
  retypeNewPasswordControl.setErrors(null);
  return null;
}
