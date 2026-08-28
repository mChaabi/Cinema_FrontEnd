import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAdd } from './reservation-add';

describe('ReservationAdd', () => {
  let component: ReservationAdd;
  let fixture: ComponentFixture<ReservationAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
