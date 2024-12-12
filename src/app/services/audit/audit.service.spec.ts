import { TestBed } from '@angular/core/testing';

import { AuditService } from './audit.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    TestBed.get(HttpClient);
    service = TestBed.inject(AuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
