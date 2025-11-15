import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerContact } from './owner-contact';

describe('OwnerContact', () => {
  let component: OwnerContact;
  let fixture: ComponentFixture<OwnerContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
