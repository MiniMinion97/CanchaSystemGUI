import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnerDetails } from './admin-owner-details';

describe('AdminOwnerDetails', () => {
  let component: AdminOwnerDetails;
  let fixture: ComponentFixture<AdminOwnerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOwnerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOwnerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
