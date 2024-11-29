import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';

describe('SafeUrlPipe', () => {
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let pipe: SafeUrlPipe;

  beforeEach(() => {
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
