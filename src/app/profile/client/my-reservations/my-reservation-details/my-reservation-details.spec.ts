import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationDetails } from './my-reservation-details';

describe('MyReservationDetails', () => {
  let component: MyReservationDetails;
  let fixture: ComponentFixture<MyReservationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReservationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyReservationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
