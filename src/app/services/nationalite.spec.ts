import { TestBed } from '@angular/core/testing';

import { Nationalite } from './nationalite';

describe('Nationalite', () => {
  let service: Nationalite;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nationalite);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
