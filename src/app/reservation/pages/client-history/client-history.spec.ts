import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHistory } from './client-history';

describe('ClientHistory', () => {
  let component: ClientHistory;
  let fixture: ComponentFixture<ClientHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
