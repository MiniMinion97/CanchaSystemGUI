import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandHistory } from './brand-history';

describe('BrandHistory', () => {
  let component: BrandHistory;
  let fixture: ComponentFixture<BrandHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
