import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  hide = signal(true);
  firstNameErrorMsg = signal('');
  lastNameErrorMsg = signal('');
  emailErrorMsg = signal('');
  passwordErrorMsg = signal('');
  errorResponse = signal<string | null>(null);
  formSubmitted = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  constructor() {
    this.initErrorSubscriptions();
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      this.authService
        .register({
          firstName: this.registerForm.controls.firstName.value,
          lastName: this.registerForm.controls.lastName.value,
          email: this.registerForm.controls.email.value,
          password: this.registerForm.controls.password.value,
        })
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/login');
          },
          error: (err) => {
            this.errorResponse.set('Something went wrong, your email might be used. Please, try again!');
            console.error('Registration Error: ', err);
          },
        });
    } else {
      Object.values(this.registerForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  private initErrorSubscriptions(): void {
    const fields: { name: string; signal: WritableSignal<string>; messages: Record<string, string> }[] = [
      {
        name: 'firstName',
        signal: this.firstNameErrorMsg,
        messages: {
          required: 'First name is required',
          minlength: 'First name must be at least 2 characters long',
          maxlength: 'First name cannot exceed 30 characters',
        },
      },
      {
        name: 'lastName',
        signal: this.lastNameErrorMsg,
        messages: {
          required: 'Last name is required',
          minlength: 'Last name must be at least 2 characters long',
          maxlength: 'Last name cannot exceed 30 characters',
        },
      },
      {
        name: 'email',
        signal: this.emailErrorMsg,
        messages: {
          required: 'Email is required',
          email: 'Please enter a valid email address',
        },
      },
      {
        name: 'password',
        signal: this.passwordErrorMsg,
        messages: {
          required: 'Password is required',
          minlength: 'Password must be at least 8 characters long',
          maxlength: 'Password cannot exceed 16 characters',
        },
      },
    ];
    fields.forEach(({ name, signal, messages }) => {
      merge(this.registerForm.get(name)!.statusChanges, this.registerForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMsg(name, signal, messages));
    });
  }

  private updateErrorMsg(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ): void {
    const control = this.registerForm.get(controlName);
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control?.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }
}
