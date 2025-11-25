import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstablishments } from './admin-establishments';

describe('AdminEstablishments', () => {
  let component: AdminEstablishments;
  let fixture: ComponentFixture<AdminEstablishments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEstablishments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEstablishments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
