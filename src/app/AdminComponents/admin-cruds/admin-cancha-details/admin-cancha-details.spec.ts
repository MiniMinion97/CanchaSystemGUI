import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCanchaDetails } from './admin-cancha-details';

describe('AdminCanchaDetails', () => {
  let component: AdminCanchaDetails;
  let fixture: ComponentFixture<AdminCanchaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCanchaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCanchaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
