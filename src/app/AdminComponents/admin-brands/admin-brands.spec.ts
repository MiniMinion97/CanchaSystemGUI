import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrands } from './admin-brands';

describe('AdminBrands', () => {
  let component: AdminBrands;
  let fixture: ComponentFixture<AdminBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
