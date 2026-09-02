import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, input, output, signal } from '@angular/core';
import { Film } from '../../../models/film';
import { FilmStarRatingComponent } from '../film-star-rating/film-star-rating';
import {
  formatDuration,
  getGenreLabel,
  getMediaFilePath,
  getPosterUrl,
  getShortSynopsis,
  getVideoMedias,
  getYearLabel,
  handlePosterError,
  resolveMediaUrl
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

  @ViewChild('previewVideo') videoRef?: ElementRef<HTMLVideoElement>;

  readonly isHovering = signal(false);

  readonly getPosterUrl = getPosterUrl;
  readonly getShortSynopsis = getShortSynopsis;
  readonly getGenreLabel = getGenreLabel;
  readonly getYearLabel = getYearLabel;
  readonly formatDuration = formatDuration;
  readonly handlePosterError = handlePosterError;

  get previewVideoUrl(): string | null {
    const videos = getVideoMedias(this.film());
    const path = getMediaFilePath(videos[0]);
    return path ? resolveMediaUrl(path) : null;
  }

  onMouseEnter(): void {
    if (!this.previewVideoUrl) return;
    this.isHovering.set(true);
    setTimeout(() => this.videoRef?.nativeElement?.play(), 50);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
    const video = this.videoRef?.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  openDetails(): void {
    this.viewDetails.emit(this.film());
  }

  openReviews(): void {
    this.viewReviews.emit(this.film());
  }
}