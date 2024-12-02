import { CommonModule } from '@angular/common';
import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Editor, NgxEditorModule, schema, Toolbar } from 'ngx-editor';
import { merge, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule, MatFormFieldModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
})
export class RichTextEditorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  control = input.required<FormControl>();
  toolbar = input<Toolbar>([
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ]);
  keyboardShortcuts = input<boolean>(true);
  history = input<boolean>(true);
  title = input<string>();
  placeholder = input<string>('Type here...');
  maxlength = input<number>();
  minlength = input<number>();
  errorMessages = input<Record<string, string>>({
    required: 'Default error: required.',
    maxlength: 'Default error: minlength.',
    minlength: 'Default error: maxlength.',
  });
  errorMessageResult = signal('');

  editor!: Editor;

  ngOnInit(): void {
    this.editor = new Editor({ schema, keyboardShortcuts: this.keyboardShortcuts(), history: this.history() });
    console.log(this.control());
    merge(this.control().statusChanges, this.control().valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getErrorMessage());
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    console.log('Destroy: ', this.destroy$);
    this.destroy$.next();
    this.destroy$.complete();
  }

  getErrorMessage() {
    for (const [key, msg] of Object.entries(this.errorMessages())) {
      console.log(this.control());
      if (this.control().hasError(key)) {
        this.errorMessageResult.set(msg);
        return;
      }
    }
    this.errorMessageResult.set('Unknown error.');
  }
}
