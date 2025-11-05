import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCanchasComponent } from './my-canchas.component';

describe('MyCanchasComponent', () => {
  let component: MyCanchasComponent;
  let fixture: ComponentFixture<MyCanchasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCanchasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCanchasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
