import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOwnerReviews } from './my-owner-reviews';

describe('MyOwnerReviews', () => {
  let component: MyOwnerReviews;
  let fixture: ComponentFixture<MyOwnerReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOwnerReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOwnerReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
