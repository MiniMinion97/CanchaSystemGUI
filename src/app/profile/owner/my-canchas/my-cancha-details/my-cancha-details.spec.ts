import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCanchaDetails } from './my-cancha-details';

describe('MyCanchaDetails', () => {
  let component: MyCanchaDetails;
  let fixture: ComponentFixture<MyCanchaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCanchaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCanchaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
