import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxEditorModule } from 'ngx-editor';
import { Validators as NgxEditorValidators } from 'ngx-editor';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor.component';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { CourseCreateDto, CourseUpdateDto, TopicOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { StorageService } from '../../../auth/services/storage.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);
  difficultyLevels = Object.values(CourseCreateDto.DifficultyLevelEnum);
  topics = input<TopicOverviewDto[] | undefined>([]);
  isEditMode = input<boolean>(false);
  courseData = input<CourseUpdateDto | undefined>();
  createdCourse = output<CourseCreateDto>();
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
    topicId: [0, [Validators.required]],
    difficultyLevel: [CourseCreateDto.DifficultyLevelEnum.Beginner, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.isEditMode() && this.courseData()) {
      this.courseForm.patchValue({
        title: this.courseData()?.title,
        shortDescription: this.courseData()?.shortDescription,
        passingScore: this.courseData()?.passingScore,
        topicId: this.courseData()?.topicId,
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
      const userProfile = this.storageService.getItem('userProfile');
      if (userProfile) {
        const userId = JSON.parse(userProfile).id;
        this.createdCourse.emit({
          title: this.courseForm.controls.title.value,
          shortDescription: this.courseForm.controls.shortDescription.value,
          fullDescription: this.courseForm.controls.fullDescription.value,
          requirements: this.courseForm.controls.requirements.value,
          passingScore: this.courseForm.controls.passingScore.value,
          topicId: this.courseForm.controls.topicId.value,
          difficultyLevel: this.courseForm.controls.difficultyLevel.value,
          authorId: userId,
        });
      }
    } else {
      Object.values(this.courseForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  formatDifficultyLevel(difficulyLevel: CourseCreateDto.DifficultyLevelEnum): string {
    return EnumUtils.formatDifficultyLevel(difficulyLevel);
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
        name: 'topicId',
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
