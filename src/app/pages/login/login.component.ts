import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  hide = signal(true);
  emailErrorMsg = signal('');
  passwordErrorMsg = signal('');
  errorResponse = signal<string | null>(null);
  formSubmitted = false;

  loginForm = this.fb.group({
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

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.authService
        .login({
          email: this.loginForm.controls.email.value,
          password: this.loginForm.controls.password.value,
        })
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: (err) => {
            this.errorResponse.set('Wrong email or password. Please try again!');
            console.error('Error: ', err);
          },
        });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  private initErrorSubscriptions(): void {
    const fields: { name: string; signal: WritableSignal<string>; messages: Record<string, string> }[] = [
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
      merge(this.loginForm.get(name)!.statusChanges, this.loginForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMsg(name, signal, messages));
    });
  }

  private updateErrorMsg(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ): void {
    const control = this.loginForm.get(controlName);
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control?.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }
}
