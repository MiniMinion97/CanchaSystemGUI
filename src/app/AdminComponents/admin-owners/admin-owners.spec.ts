import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwners } from './admin-owners';

describe('AdminOwners', () => {
  let component: AdminOwners;
  let fixture: ComponentFixture<AdminOwners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOwners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOwners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
