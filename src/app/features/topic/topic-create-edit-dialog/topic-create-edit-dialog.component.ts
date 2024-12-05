import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  titleErrorMsg = signal('');

  topicForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: [''],
  });

  constructor(
    public dialogRef: MatDialogRef<TopicCreateEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TopicUpdateDto | null
  ) {
    this.isEditMode.set(!!data);
    merge(this.topicForm.controls.title.statusChanges, this.topicForm.controls.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMsg());
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

  updateErrorMsg() {
    const titleControl = this.topicForm.controls.title;
    this.titleErrorMsg.set(
      titleControl.hasError('required')
        ? 'Enter valid topic title.'
        : titleControl.hasError('minlength')
          ? 'Title must be at least 5 characters long.'
          : ''
    );
  }
}
