import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingFilms } from './upcoming-films';

describe('UpcomingFilms', () => {
  let component: UpcomingFilms;
  let fixture: ComponentFixture<UpcomingFilms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingFilms],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingFilms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
