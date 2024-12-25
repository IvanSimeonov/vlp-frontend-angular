import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
