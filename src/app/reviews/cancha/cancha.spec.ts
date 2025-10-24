import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cancha } from './cancha';

describe('Cancha', () => {
  let component: Cancha;
  let fixture: ComponentFixture<Cancha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cancha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cancha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
