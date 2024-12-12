import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  constructor(private http: HttpClient) {}

  getDemoShadows(type: string, id: number): Observable<JaversShadowDto[]> {
    type = 'bg.tusofia.vlp.lecture.domain.Lecture';
    id = 42;
    return this.http.get(`/api/v1/audit/shadows?typeName=${type}&id=${id}`) as Observable<JaversShadowDto[]>;
  }
}
