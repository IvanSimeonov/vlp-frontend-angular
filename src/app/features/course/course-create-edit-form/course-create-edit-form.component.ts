import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxEditorModule } from 'ngx-editor';
import { merge } from 'rxjs';
import { Validators as NgxEditorValidators } from 'ngx-editor';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor.component';
import { ICourseDetails } from '../../../pages/course-create-edit/course-create-edit.component';

export interface ITopic {
  id?: number;
  title?: string;
  description?: string;
  totalCourses?: number;
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Component({
  selector: 'app-course-create-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    NgxEditorModule,
    RichTextEditorComponent,
  ],
  templateUrl: './course-create-edit-form.component.html',
  styleUrl: './course-create-edit-form.component.scss',
})
export class CourseCreateEditFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  difficultyLevels = Object.values(DifficultyLevel);
  topics = input<ITopic[]>();
  isEditMode = input<boolean>(false);
  courseData = input<ICourseDetails | null>(null);
  createdCourse = output<ICourseDetails>();
  titleErrorMsg = signal('');
  shortDescriptionErrorMsg = signal('');
  passingScoreErrorMsg = signal('');
  topicErrorMsg = signal('');
  difficultyLevelErrorMsg = signal('');

  courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    shortDescription: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
    fullDescription: [
      '',
      [NgxEditorValidators.required(), NgxEditorValidators.minLength(300), NgxEditorValidators.maxLength(3000)],
    ],
    requirements: [
      '',
      [NgxEditorValidators.required(), NgxEditorValidators.minLength(50), NgxEditorValidators.maxLength(500)],
    ],
    passingScore: [0, [Validators.required, Validators.min(50), Validators.max(100)]],
    topic: [0, [Validators.required]],
    difficultyLevel: [DifficultyLevel.BEGINNER, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.isEditMode() && this.courseData()) {
      this.courseForm.patchValue({
        title: this.courseData()?.title,
        shortDescription: this.courseData()?.shortDescription,
        passingScore: this.courseData()?.passingScore,
        topic: 1,
        difficultyLevel: this.courseData()?.difficultyLevel,
        requirements: this.courseData()?.requirements,
        fullDescription: this.courseData()?.fullDescription,
      });
    }
  }

  constructor() {
    this.initErrorSubscriptions();
  }

  onCreate() {
    if (this.courseForm.valid) {
      this.createdCourse.emit(this.courseForm.value);
    } else {
      Object.values(this.courseForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  formatDifficultyLevel(difficulyLevel: DifficultyLevel): string {
    switch (difficulyLevel) {
      case DifficultyLevel.BEGINNER:
        return 'Beginner';
      case DifficultyLevel.INTERMEDIATE:
        return 'Intermediate';
      case DifficultyLevel.ADVANCED:
        return 'Advanced';
      default:
        return difficulyLevel;
    }
  }

  private initErrorSubscriptions(): void {
    const fields: { name: string; signal: WritableSignal<string>; messages: Record<string, string> }[] = [
      {
        name: 'title',
        signal: this.titleErrorMsg,
        messages: {
          required: 'Enter title',
          minlength: 'Enter title that is 5 to 50 characters long',
          maxlength: 'Enter title that is 5 to 50 characters long',
        },
      },
      {
        name: 'shortDescription',
        signal: this.shortDescriptionErrorMsg,
        messages: {
          required: 'Enter short description',
          minlength: 'Enter short description that is 50 to 300 characters long',
          maxlength: 'Enter short description that is 50 to 300 characters long',
        },
      },
      {
        name: 'passingScore',
        signal: this.passingScoreErrorMsg,
        messages: {
          required: 'Enter passing score',
          min: 'Enter passing score number between 50 to 100',
          max: 'Enter passing score number between 50 to 100',
        },
      },
      {
        name: 'topic',
        signal: this.topicErrorMsg,
        messages: {
          required: 'Enter course topic',
        },
      },
      {
        name: 'difficultyLevel',
        signal: this.difficultyLevelErrorMsg,
        messages: {
          required: 'Enter difficulty level',
        },
      },
    ];
    fields.forEach(({ name, signal, messages }) => {
      merge(this.courseForm.get(name)!.statusChanges, this.courseForm.get(name)!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMsg(name, signal, messages));
    });
  }

  private updateErrorMsg(
    controlName: string,
    errorMsgSignal: WritableSignal<string>,
    messages: Record<string, string>
  ): void {
    const control = this.courseForm.get(controlName);
    for (const [errorKey, errorMsg] of Object.entries(messages)) {
      if (control?.hasError(errorKey)) {
        errorMsgSignal.set(errorMsg);
        return;
      }
    }
    errorMsgSignal.set('');
  }
}
