import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEstablishmentsComponent } from './my-establishments.component';

describe('MyEstablishmentsComponent', () => {
  let component: MyEstablishmentsComponent;
  let fixture: ComponentFixture<MyEstablishmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEstablishmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEstablishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
