import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-user-new-admin-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './user-new-admin-dialog.component.html',
  styleUrl: './user-new-admin-dialog.component.scss',
})
export class UserNewAdminDialogComponent {
  private formBuilder = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<UserNewAdminDialogComponent>);
  hide = signal(true);
  firstNameErrorMsg = signal('');
  lastNameErrorMsg = signal('');
  emailErrorMsg = signal('');
  passwordErrorMsg = signal('');

  createAdminForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  constructor() {
    this.initErrorSubscriptions();
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.update((hide) => !hide);
    event.stopPropagation();
  }

  createAdmin(): void {
    console.warn(this.createAdminForm.value);
    this.dialogRef.close();
  }

  cancel(): void {
    this.createAdminForm.reset();
    this.dialogRef.close();
  }

  markAsTouched(controlName: string): void {
    const control = this.createAdminForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  private initErrorSubscriptions(): void {
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
      {
        name: 'email',
        signal: this.emailErrorMsg,
        messages: { required: 'Enter your email address', email: 'Enter a valid email address' },
      },
      {
        name: 'password',
        signal: this.passwordErrorMsg,
        messages: {
          required: 'Enter your password',
          minlength: 'Enter a password that is 8 to 16 characters long',
          maxlength: 'Enter a password that is 8 to 16 characters long',
        },
      },
    ];

    fields.forEach(({ name, signal, messages }) => {
      merge(this.createAdminForm.get(name)!.statusChanges, this.createAdminForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessage(name, signal, messages));
    });
  }

  private updateErrorMessage(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ) {
    const control = this.createAdminForm.get(controlName)!;
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }
}
