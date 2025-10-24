import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaMetrics } from './cancha-metrics';

describe('CanchaMetrics', () => {
  let component: CanchaMetrics;
  let fixture: ComponentFixture<CanchaMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchaMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchaMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
