import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor.component';
import { Validators as NgxEditorValidators } from 'ngx-editor';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

export interface ILecture {
  title: string;
  description: string;
  videoUrl: string;
  assignmentTask: string;
  sequenceNumber: number;
  courseId: number;
}

@Component({
  selector: 'app-lecture-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    CdkDropList,
    CdkDrag,
    RichTextEditorComponent,
  ],
  templateUrl: './lecture-management.component.html',
  styleUrl: './lecture-management.component.scss',
})
export class LectureManagementComponent {
  private fb = inject(FormBuilder);
  courseId = input.required<number>();
  addedLectures = output<ILecture[]>();
  lectures: { form: FormGroup; errorSignals: Record<string, WritableSignal<string>> }[] = [];

  constructor() {
    this.addLecture();
    this.addLecture();
    this.addLecture();
  }

  saveLectures() {
    if (this.lectures.length >= 3 && this.lectures.every((lecture) => lecture.form.valid)) {
      this.addedLectures.emit(this.lectures.map((lecture) => lecture.form.value));
    } else {
      this.lectures.forEach((lecture) => {
        console.log(lecture);
        Object.values(lecture.form.controls).forEach((control) => {
          control.markAsTouched();
          control.updateValueAndValidity();
        });
      });
    }
  }

  addLecture() {
    const lectureForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      videoUrl: ['', [Validators.required]],
      description: [
        '',
        NgxEditorValidators.required(),
        NgxEditorValidators.minLength(100),
        NgxEditorValidators.maxLength(300),
      ],
      assignmentTask: [
        '',
        NgxEditorValidators.required(),
        NgxEditorValidators.minLength(300),
        NgxEditorValidators.maxLength(1000),
      ],
      courseId: [this.courseId],
      sequenceNumber: [this.lectures.length + 1],
    });
    const errorSignals = {
      title: signal(''),
      description: signal(''),
      videoUrl: signal(''),
      assignmentTask: signal(''),
    };
    this.initErrorSubscriptions(lectureForm, errorSignals);
    this.lectures.push({ form: lectureForm, errorSignals });
  }

  removeLecture(event: Event, index: number) {
    event.stopPropagation();
    this.lectures.splice(index, 1);
    this.updateSequenceNumber();
  }

  onDrop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.lectures, event.previousIndex, event.currentIndex);
    this.updateSequenceNumber();
  }

  getFormControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }

  private updateSequenceNumber() {
    this.lectures.forEach((lecture, index) => {
      lecture.form.patchValue({ sequenceNumber: index + 1 });
    });
  }

  private initErrorSubscriptions(formGroup: FormGroup, errorSignals: Record<string, WritableSignal<string>>): void {
    Object.entries(errorSignals).forEach(([controlName, signal]) => {
      const control = formGroup.get(controlName);

      if (!control) {
        console.warn(`Control '${controlName}' does not exist in the form group.`);
        return;
      }

      const messages: Record<string, string> = this.getErrorMessages(controlName);

      merge(control.statusChanges, control.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          for (const [errorKey, errorMsg] of Object.entries(messages)) {
            if (control.hasError(errorKey)) {
              signal.set(errorMsg);
              return;
            }
          }
          signal.set('');
        });
    });
  }

  private getErrorMessages(controlName: string): Record<string, string> {
    const errorMessages: Record<string, Record<string, string>> = {
      title: {
        required: 'Title is required.',
        minlength: 'Title must be at least 10 characters.',
        maxlength: 'Title must not exceed 100 characters.',
      },
      videoUrl: {
        required: 'Video URL is required.',
      },
      description: {
        required: 'Description is required.',
        minlength: 'Description must be at least 100 characters.',
        maxlength: 'Description must not exceed 300 characters.',
      },
      assignmentTask: {
        required: 'Assignment task is required.',
        minlength: 'Task must be at least 300 characters.',
        maxlength: 'Task must not exceed 1000 characters.',
      },
    };
    return errorMessages[controlName] || {};
  }
}
