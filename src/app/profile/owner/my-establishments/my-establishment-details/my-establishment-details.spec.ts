import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEstablishmentDetails } from './my-establishment-details';

describe('MyEstablishmentDetails', () => {
  let component: MyEstablishmentDetails;
  let fixture: ComponentFixture<MyEstablishmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEstablishmentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEstablishmentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
