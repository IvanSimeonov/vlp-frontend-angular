import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor.component';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { Validators as NgxEditorValidators } from 'ngx-editor';

export interface ILecture {
  title: string;
  description: string;
  videoUrl: string;
  assignmentTask: string;
  sequenceNumber: number;
  courseId: number;
}

export interface LectureTypeForm {
  title: FormControl<string>;
  description: FormControl<string>;
  videoUrl: FormControl<string>;
  assignmentTask: FormControl<string>;
  sequenceNumber: FormControl<number>;
  courseId: FormControl<number>;
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
  private fb = inject(NonNullableFormBuilder);
  courseId = input.required<number>();

  addedLectures = output<ILecture[]>();

  form: FormGroup<{ lectures: FormArray<FormGroup<LectureTypeForm>> }> = this.fb.group({
    lectures: this.fb.array<FormGroup<LectureTypeForm>>([]),
  });

  errorMessages = new Map<number, Record<string, ReturnType<typeof signal>>>();

  get lectures(): FormArray<FormGroup<LectureTypeForm>> {
    return this.form.controls.lectures;
  }

  constructor() {
    this.addLecture();
  }

  saveLectures() {
    const lectureData: ILecture[] = this.lectures.controls.map((control) => ({
      title: control.controls.title.value,
      description: control.controls.description.value,
      videoUrl: control.controls.videoUrl.value,
      assignmentTask: control.controls.assignmentTask.value,
      sequenceNumber: control.controls.sequenceNumber.value,
      courseId: this.courseId(),
    }));
    this.addedLectures.emit(lectureData);
  }

  addLecture() {
    const lectureForm: FormGroup<LectureTypeForm> = this.fb.group<LectureTypeForm>({
      title: this.fb.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      description: this.fb.control('', [
        NgxEditorValidators.required(),
        NgxEditorValidators.minLength(50),
        NgxEditorValidators.maxLength(500),
      ]),
      videoUrl: this.fb.control('', [Validators.required]),
      assignmentTask: this.fb.control('', [
        NgxEditorValidators.required(),
        NgxEditorValidators.minLength(50),
        NgxEditorValidators.maxLength(500),
      ]),
      sequenceNumber: this.fb.control(this.lectures.length + 1, Validators.required),
      courseId: this.fb.control(0, Validators.required),
    });
    this.lectures.push(lectureForm);
  }

  removeLecture(event: Event, lectureIndex: number) {
    event.stopPropagation();
    this.lectures.removeAt(lectureIndex);
    this.updateSequenceNumber();
  }

  private updateSequenceNumber() {
    this.lectures.controls.forEach((lectureForm, index) => {
      lectureForm.controls.sequenceNumber.patchValue(index + 1);
    });
  }

  titleErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'Title is required';
    } else {
      return 'Title must be 5 to 500 chars longs';
    }
  }
  videoUrlErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'Video URL is required';
    } else {
      return 'Video URL must be a valid YouTube url';
    }
  }
}
