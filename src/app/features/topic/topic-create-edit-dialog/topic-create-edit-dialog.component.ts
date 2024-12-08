import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopicCreateDto, TopicUpdateDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-topic-create-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './topic-create-edit-dialog.component.html',
  styleUrl: './topic-create-edit-dialog.component.scss',
})
export class TopicCreateEditDialogComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  isEditMode = signal(false);
  errorMessages = signal<Record<string, string>>({});
  topicForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
  });

  constructor(
    public dialogRef: MatDialogRef<TopicCreateEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TopicUpdateDto | null
  ) {
    this.isEditMode.set(!!data);
    merge(
      this.topicForm.controls.title.statusChanges,
      this.topicForm.controls.title.valueChanges,
      this.topicForm.controls.description.statusChanges,
      this.topicForm.controls.description.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.topicForm.patchValue({
        title: this.data?.title,
        description: this.data?.description,
      });
    }
  }

  onSubmit() {
    if (this.topicForm.valid) {
      const formValue = this.topicForm.getRawValue();
      if (this.isEditMode()) {
        const updateDto: TopicUpdateDto = {
          id: this.data!.id,
          ...formValue,
        };
        this.dialogRef.close(updateDto);
      } else {
        const createDto: TopicCreateDto = formValue;
        this.dialogRef.close(createDto);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  markAsTouched(controlName: string): void {
    const control = this.topicForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  private updateErrorMessages() {
    const controls = this.topicForm.controls;

    this.errorMessages.set({
      title: this.getErrorMessage(controls.title, 'Title', 5, 50),
      description: this.getErrorMessage(controls.description, 'Description', 10, 100),
    });
  }

  private getErrorMessage(control: FormControl, fieldName: string, minLength: number, maxLength: number): string {
    if (control.hasError('required')) {
      return `Enter valid ${fieldName.toLowerCase()}.`;
    }
    if (control.hasError('minlength') || control.hasError('maxlength')) {
      return `${fieldName} must be between ${minLength} and ${maxLength} characters long.`;
    }
    return '';
  }
}
