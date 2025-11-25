import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientDetails } from './admin-client-details';

describe('AdminClientDetails', () => {
  let component: AdminClientDetails;
  let fixture: ComponentFixture<AdminClientDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
