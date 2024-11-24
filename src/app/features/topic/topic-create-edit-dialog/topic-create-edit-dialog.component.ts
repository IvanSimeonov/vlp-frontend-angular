import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ITopic } from '../topic-management/topic-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class TopicCreateEditDialogComponent {
  topicForm: FormGroup;
  titleErrorMsg = signal('');

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TopicCreateEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITopic | null
  ) {
    this.topicForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
    });
    const formElement = this.topicForm.get('title');
    merge(formElement!.statusChanges, formElement!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMsg());
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.topicForm.valid) {
      const formValue = this.topicForm.value;
      console.log(formValue);
      this.dialogRef.close();
    }
  }

  markAsTouched(controlName: string): void {
    const control = this.topicForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  updateErrorMsg() {
    console.log('Hi');
    if (this.topicForm.get('title')?.hasError('required')) {
      this.titleErrorMsg.set('Enter valid topic title.');
    } else {
      this.titleErrorMsg.set('');
    }
  }
}
