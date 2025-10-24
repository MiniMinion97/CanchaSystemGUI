import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMetrics } from './owner-metrics';

describe('OwnerMetrics', () => {
  let component: OwnerMetrics;
  let fixture: ComponentFixture<OwnerMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
