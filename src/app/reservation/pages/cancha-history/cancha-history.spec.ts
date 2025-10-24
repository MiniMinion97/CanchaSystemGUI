import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaHistory } from './cancha-history';

describe('CanchaHistory', () => {
  let component: CanchaHistory;
  let fixture: ComponentFixture<CanchaHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchaHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchaHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
