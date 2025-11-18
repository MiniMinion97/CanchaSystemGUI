import { TestBed } from '@angular/core/testing';

import { EstablishmentStore } from '../establishment-store';

describe('EstablishmentStore', () => {
  let service: EstablishmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstablishmentStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
