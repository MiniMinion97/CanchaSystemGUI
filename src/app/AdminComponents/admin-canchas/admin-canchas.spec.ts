import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCanchas } from './admin-canchas';

describe('AdminCanchas', () => {
  let component: AdminCanchas;
  let fixture: ComponentFixture<AdminCanchas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCanchas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCanchas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
