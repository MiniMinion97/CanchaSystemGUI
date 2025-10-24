import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMetrics } from './brand-metrics';

describe('BrandMetrics', () => {
  let component: BrandMetrics;
  let fixture: ComponentFixture<BrandMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
