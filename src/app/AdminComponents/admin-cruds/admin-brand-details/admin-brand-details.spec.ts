import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrandDetails } from './admin-brand-details';

describe('AdminBrandDetails', () => {
  let component: AdminBrandDetails;
  let fixture: ComponentFixture<AdminBrandDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrandDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBrandDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
