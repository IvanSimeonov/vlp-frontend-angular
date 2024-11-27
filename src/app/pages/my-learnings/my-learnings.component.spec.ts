import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLearningsComponent } from './my-learnings.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('MyLearningsComponent', () => {
  let component: MyLearningsComponent;
  let fixture: ComponentFixture<MyLearningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLearningsComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLearningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
