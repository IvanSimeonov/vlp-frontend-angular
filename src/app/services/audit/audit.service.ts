import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseDetailsDto, LectureDto, UserOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { Observable } from 'rxjs';

export interface JaversShadowDto {
  commitMetadata: {
    author: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: any;
    commitDate: Date;
    id: {
      majorId: number;
      minorId: number;
    };
  };
  changed: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: any[];
  version: number;
  isInitial: boolean;
  objectId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  constructor(private http: HttpClient) {}

  getDemoShadows(type: string, id: number): Observable<JaversShadowDto[]> {
    return this.http.get<JaversShadowDto[]>(`/api/v1/audit/shadows?typeName=${type}&id=${id}`);
  }

  getCourseVersion(id: number, version: number): Observable<CourseDto> {
    return this.http.get<CourseDto>(`/api/v1/audit/course/${id}?version=${version}`);
  }
}

export interface CourseDto extends CourseDetailsDto {
  lectures: LectureDto[];
  completedUsers: UserOverviewDto[];
  enrolledUsers: UserOverviewDto[];
}

export interface Course {
  id?: number;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  requirements?: string;
  averageRating?: number;
  totalRatings?: number;
  author?: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    enabled?: boolean;
    created?: string;
    profileImagePath?: string;
  };
  lectures: {
    id?: number;
    title: string;
    description: string;
    videoUrl: string;
    assignmentTask: string;
    sequenceNumber?: number;
    courseId: number;
  }[];
  completedUsers: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    enabled?: boolean;
    created?: string;
    profileImagePath?: string;
  }[];
}
