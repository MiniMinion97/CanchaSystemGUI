import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBrandDetails } from './my-brand-details';

describe('MyBrandDetails', () => {
  let component: MyBrandDetails;
  let fixture: ComponentFixture<MyBrandDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBrandDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBrandDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
