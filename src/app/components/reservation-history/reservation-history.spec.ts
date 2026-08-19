import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationHistoryComponent } from './reservation-history';

describe('ReservationHistory', () => {
  let component: ReservationHistoryComponent;
  let fixture: ComponentFixture<ReservationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
