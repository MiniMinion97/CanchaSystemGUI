import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOwnerReservations } from './my-owner-reservations';

describe('MyOwnerReservations', () => {
  let component: MyOwnerReservations;
  let fixture: ComponentFixture<MyOwnerReservations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOwnerReservations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOwnerReservations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
