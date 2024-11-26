import { Component, inject, OnDestroy, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { FileUploadComponent, IFile } from '../../../components/file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Editor, NgxEditorModule, schema, Toolbar } from 'ngx-editor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';

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
  ],
  templateUrl: './user-edit-profile.component.html',
  styleUrl: './user-edit-profile.component.scss',
})
export class UserEditProfileComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  accordion = viewChild.required(MatAccordion);
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  maxFileSizeMB = 10;
  isAccessRequested = false;
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

  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideRetypeNewPassword = signal(true);
  firstNameErrorMsg = signal('');
  lastNameErrorMsg = signal('');
  passwordErrorMsg = signal('');
  newPasswordErrorMsg = signal('');
  retypeNewPasswordErrorMsg = signal('');

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
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onImageUpload(file: IFile): void {
    console.log(file);
    if (file) {
      console.log('Uploading file...');
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

  onPersonalDataUpdate() {
    console.log(this.updatePersonalDataForm.value);
  }

  onChangePassword() {
    console.log(this.updateSecurityDataForm.value);
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
        },
      },
      {
        name: 'retypeNewPassword',
        signal: this.retypeNewPasswordErrorMsg,
        messages: {
          required: 'Enter your password',
          minlength: 'Enter a password that is 8 to 16 characters long',
          maxlength: 'Enter a password that is 8 to 16 characters long',
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
