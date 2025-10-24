import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTab } from './auth-tab';

describe('AuthTab', () => {
  let component: AuthTab;
  let fixture: ComponentFixture<AuthTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
