import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { provideHttpClient } from '@angular/common/http';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, provideHttpClient()],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
