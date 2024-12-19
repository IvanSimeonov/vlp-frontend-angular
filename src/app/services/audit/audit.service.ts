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
    return this.http.get<JaversShadowDto[]>(`/api/v1/audit/shadows?typeName=${type}&id=${id}`);
  }
}
