import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Film } from '../../../models/film';
import { FilmStarRatingComponent } from '../film-star-rating/film-star-rating';
import {
  filmKey,
  formatDuration,
  getGenreLabel,
  getPosterUrl,
  getShortSynopsis,
  getYearLabel,
  handlePosterError
} from '../utils/film.utils';

@Component({
  selector: 'app-film-carousel',
  standalone: true,
  imports: [FilmStarRatingComponent],
  templateUrl: './film-carousel.html',
  styleUrl: './film-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmCarouselComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private autoplayId: ReturnType<typeof setInterval> | null = null;

  readonly films = input<Film[]>([]);
  readonly viewDetails = output<Film>();

  readonly currentIndex = signal(0);
  readonly filmKey = filmKey;
  readonly getPosterUrl = getPosterUrl;
  readonly getShortSynopsis = getShortSynopsis;
  readonly handlePosterError = handlePosterError;
  readonly getGenreLabel = getGenreLabel;
  readonly getYearLabel = getYearLabel;
  readonly formatDuration = formatDuration;

  readonly hasMultiple = computed(() => this.films().length > 1);

  constructor() {
    effect(() => {
      const total = this.films().length;
      if (this.currentIndex() >= total) {
        this.currentIndex.set(0);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
      this.destroyRef.onDestroy(() => this.stopAutoplay());
    }
  }

  goTo(index: number): void {
    const total = this.films().length;
    if (total === 0) {
      return;
    }

    this.currentIndex.set((index + total) % total);
    this.restartAutoplay();
  }

  next(): void {
    this.goTo(this.currentIndex() + 1);
  }

  previous(): void {
    this.goTo(this.currentIndex() - 1);
  }

  pause(): void {
    this.stopAutoplay();
  }

  resume(): void {
    this.startAutoplay();
  }

  openDetails(film: Film): void {
    this.viewDetails.emit(film);
  }

  private startAutoplay(): void {
    if (this.autoplayId || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.autoplayId = setInterval(() => {
      if (this.hasMultiple()) {
        this.currentIndex.update((index) => (index + 1) % this.films().length);
      }
    }, 6000);
  }

  private stopAutoplay(): void {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
