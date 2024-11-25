import { Component, viewChild } from '@angular/core';
import { FileUploadComponent, IFile } from '../../../components/file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './user-edit-profile.component.html',
  styleUrl: './user-edit-profile.component.scss',
})
export class UserEditProfileComponent {
  accordion = viewChild.required(MatAccordion);
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  maxFileSizeMB = 10;
  isAccessRequested = false;

  onImageUpload(file: IFile): void {
    console.log(file);
  }
}
