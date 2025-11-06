import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBrandsComponent } from './my-brands.component';

describe('MyBrandsComponent', () => {
  let component: MyBrandsComponent;
  let fixture: ComponentFixture<MyBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
