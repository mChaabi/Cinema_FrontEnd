import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Film } from '../../../models/film';
import { FilmStarRatingComponent } from '../film-star-rating/film-star-rating';
import {
  formatDuration,
  getGenreLabel,
  getPosterUrl,
  getShortSynopsis,
  getYearLabel,
  handlePosterError
} from '../utils/film.utils';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [FilmStarRatingComponent],
  templateUrl: './film-card.html',
  styleUrl: './film-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmCardComponent {
  readonly film = input.required<Film>();
  readonly viewDetails = output<Film>();
  readonly viewReviews = output<Film>();

  readonly getPosterUrl = getPosterUrl;
  readonly getShortSynopsis = getShortSynopsis;
  readonly getGenreLabel = getGenreLabel;
  readonly getYearLabel = getYearLabel;
  readonly formatDuration = formatDuration;
  readonly handlePosterError = handlePosterError;

  openDetails(): void {
    this.viewDetails.emit(this.film());
  }

  openReviews(): void {
    this.viewReviews.emit(this.film());
  }
}
