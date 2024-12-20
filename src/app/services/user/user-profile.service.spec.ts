import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import { provideHttpClient } from '@angular/common/http';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
