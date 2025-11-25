import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstablishmentDetails } from './admin-establishment-details';

describe('AdminEstablishmentDetails', () => {
  let component: AdminEstablishmentDetails;
  let fixture: ComponentFixture<AdminEstablishmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEstablishmentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEstablishmentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
