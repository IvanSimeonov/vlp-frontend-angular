import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
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
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { LectureDetailDto, LectureDto } from '@ivannicksim/vlp-backend-openapi-client';

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
    CdkDragPlaceholder,
    RichTextEditorComponent,
  ],
  templateUrl: './lecture-management.component.html',
  styleUrl: './lecture-management.component.scss',
})
export class LectureManagementComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  courseId = input.required<number>();
  isFormSubmitted = false;
  isEditMode = input<boolean>(false);
  lecturesData = input<LectureDetailDto[] | undefined>();
  addedLectures = output<LectureDto[]>();

  form: FormGroup<{ lectures: FormArray<FormGroup<LectureTypeForm>> }> = this.fb.group({
    lectures: this.fb.array<FormGroup<LectureTypeForm>>([], [Validators.minLength(3)]),
  });

  errorMessages = new Map<number, Record<string, ReturnType<typeof signal>>>();

  get lectures(): FormArray<FormGroup<LectureTypeForm>> {
    return this.form.controls.lectures;
  }

  ngOnInit(): void {
    if (this.isEditMode() && this.lecturesData()) {
      this.lectures.clear();
      this.lecturesData()!.forEach((lecture) => {
        this.addLecture(lecture);
      });
    } else {
      this.addLecture();
    }
  }

  saveLectures() {
    this.isFormSubmitted = true;
    if (this.form.valid && this.lectures.controls.length >= 3) {
      const lectureData: LectureDto[] = this.lectures.controls.map((control, index) => {
        const existingLecture = this.lecturesData()?.[index];
        return {
          id: existingLecture?.id || undefined,
          title: control.controls.title.value,
          description: control.controls.description.value,
          shortDescription: control.controls.description.value.slice(0, 50),
          fullDescription: control.controls.description.value,
          videoUrl: control.controls.videoUrl.value,
          assignmentTask: control.controls.assignmentTask.value,
          sequenceNumber: control.controls.sequenceNumber.value,
          courseId: this.courseId(),
        };
      });
      this.addedLectures.emit(lectureData);
    } else {
      this.lectures.controls.forEach((control) => {
        control.markAllAsTouched();
        control.controls.title.updateValueAndValidity();
        control.controls.description.updateValueAndValidity();
        control.controls.videoUrl.updateValueAndValidity();
        control.controls.assignmentTask.updateValueAndValidity();
      });
    }
  }

  addLecture(lecture?: LectureDetailDto) {
    const lectureForm: FormGroup<LectureTypeForm> = this.fb.group<LectureTypeForm>({
      title: this.fb.control(lecture?.title || '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      description: this.fb.control(lecture?.description || '', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500),
      ]),
      videoUrl: this.fb.control(lecture?.videoUrl || '', [Validators.required]),
      assignmentTask: this.fb.control(lecture?.assignmentTask || '', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500),
      ]),
      sequenceNumber: this.fb.control(lecture?.sequenceNumber || this.lectures.length + 1, Validators.required),
      courseId: this.fb.control(this.courseId(), Validators.required),
    });
    this.lectures.push(lectureForm);
    this.initializeErrorSignals(lectureForm, this.lectures.length - 1);
  }

  removeLecture(event: Event, lectureIndex: number) {
    event.stopPropagation();
    this.lectures.removeAt(lectureIndex);
    this.updateSequenceNumber();
  }

  onDrop(event: CdkDragDrop<FormGroup<LectureTypeForm>[]>) {
    const lecturesFormArray = this.lectures;
    const control = lecturesFormArray.at(event.previousIndex);
    lecturesFormArray.removeAt(event.previousIndex);
    lecturesFormArray.insert(event.currentIndex, control);
    this.updateSequenceNumber();
  }

  isFormValid(): boolean {
    return this.isFormSubmitted && (this.form.invalid || this.form.controls.lectures.length < 3);
  }

  private updateSequenceNumber() {
    this.lectures.controls.forEach((lectureForm, index) => {
      lectureForm.controls.sequenceNumber.patchValue(index + 1);
    });
  }

  private initializeErrorSignals(form: FormGroup<LectureTypeForm>, index: number): void {
    const errorSignals = {
      title: signal(''),
      description: signal(''),
      videoUrl: signal(''),
      assignmentTask: signal(''),
      sequenceNumber: signal(''),
      courseId: signal(''),
    };
    this.errorMessages.set(index, errorSignals);
    for (const [key, control] of Object.entries(form.controls) as [keyof LectureTypeForm, FormControl][]) {
      control.statusChanges.subscribe(() => {
        const fieldName = this.capitalizeFirstLetter(key);
        if (control.hasError('required')) {
          errorSignals[key].set(`${fieldName} is required`);
        } else if (control.hasError('minlength')) {
          errorSignals[key].set(
            `${fieldName} must have min. ${control.getError('minlength')?.requiredLength} characters`
          );
        } else if (control.hasError('maxlength')) {
          errorSignals[key].set(
            `${fieldName} must have max. ${control.getError('maxlength')?.requiredLength} characters`
          );
        }
      });
    }
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
