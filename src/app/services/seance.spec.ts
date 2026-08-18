import { TestBed } from '@angular/core/testing';

import { Seance } from './seance';

describe('Seance', () => {
  let service: Seance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
