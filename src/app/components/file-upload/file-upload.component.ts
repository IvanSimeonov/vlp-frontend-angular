import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface IFile {
  name: string;
  progress: number;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() allowedFileTypes: string[] = ['image/jpeg', 'image/png'];
  @Input() maxFileSizeMB = 10;
  @Output() fileChange = new EventEmitter<IFile>();
  file: IFile | undefined;
  filePreviewUrl: string | null = null;

  constructor(private snackBar: MatSnackBar) {}

  get fileAccept() {
    return this.allowedFileTypes.join(',');
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedFile = inputElement.files?.[0];
    if (selectedFile) {
      this.handleFileInput(selectedFile);
    }
    this.resetFileInput();
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFileInput(file);
    }
    this.resetFileInput();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  removeFile(): void {
    this.file = undefined;
    this.filePreviewUrl = null;
  }

  saveFile(): void {
    if (this.file) {
      this.fileChange.emit(this.file);
    }
  }

  private handleFileInput(file: File): void {
    if (!this.isFileTypeAllowed(file)) {
      this.showError(`${file.name} is not a supported file type.`);
    } else if (!this.isFileSizeAllowed(file)) {
      this.showError(`${file.name} exceeds the maximum file size of ${this.maxFileSizeMB}MB.`);
    } else {
      this.file = { name: file.name, progress: 0 };
      this.generateFilePreview(file);
      this.fileChange.emit(this.file);
    }
  }

  private isFileTypeAllowed(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }

  private isFileSizeAllowed(file: File): boolean {
    const maxFileSizeBytes = this.maxFileSizeMB * 1024 * 1024;
    return file.size <= maxFileSizeBytes;
  }

  private resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
  }

  private showError(errorMsg: string): void {
    this.snackBar.open(errorMsg, 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }

  private generateFilePreview(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.filePreviewUrl = null;
    }
  }
}
