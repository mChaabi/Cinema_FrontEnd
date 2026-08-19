import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Film } from '../../../models/film';
import { FilmRatingService } from '../film-rating.service';
import { filmKey } from '../utils/film.utils';

@Component({
  selector: 'app-film-star-rating',
  standalone: true,
  templateUrl: './film-star-rating.html',
  styleUrl: './film-star-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmStarRatingComponent {
  private readonly ratingService = inject(FilmRatingService);

  readonly film = input.required<Film>();
  readonly compact = input(false);

  readonly stars = [1, 2, 3, 4, 5] as const;
  private readonly hovered = signal(0);

  readonly currentRating = computed(() => {
    const saved = this.ratingService.getRating(filmKey(this.film()));
    if (saved > 0) {
      return saved;
    }

    const note = this.film().note;
    if (note == null || note <= 0) {
      return 0;
    }

    return Math.min(5, Math.max(0, Math.round(note)));
  });
  readonly displayValue = computed(() => this.hovered() || this.currentRating());

  hover(value: number): void {
    this.hovered.set(value);
  }

  rate(value: number): void {
    this.ratingService.setRating(filmKey(this.film()), value);
  }
}
