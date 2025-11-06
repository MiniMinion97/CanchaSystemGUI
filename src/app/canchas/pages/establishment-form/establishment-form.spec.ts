import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentForm } from './establishment-form';

describe('EstablishmentForm', () => {
  let component: EstablishmentForm;
  let fixture: ComponentFixture<EstablishmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
