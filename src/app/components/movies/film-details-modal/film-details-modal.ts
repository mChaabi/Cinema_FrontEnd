import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Film } from '../../../models/film';
import { Media } from '../../../models/media';
import { FilmStarRatingComponent } from '../film-star-rating/film-star-rating';
import {
  formatDuration,
  formatSeanceLabel,
  getActorsLabel,
  getDescription,
  getDirectorLabel,
  getDocumentMedias,
  getFullSynopsis,
  getGenreLabel,
  getImageMedias,
  getMediaFilePath,
  getNationalityLabel,
  getPosterUrl,
  getVideoMedias,
  getYearLabel,
  handlePosterError,
  resolveMediaUrl,
  youtubeEmbedUrl
} from '../utils/film.utils';

@Component({
  selector: 'app-film-details-modal',
  standalone: true,
  imports: [FilmStarRatingComponent],
  templateUrl: './film-details-modal.html',
  styleUrl: './film-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class FilmDetailsModalComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly film = input<Film | null>(null);
  readonly isOpen = input(false);
  readonly closed = output<void>();

  readonly getPosterUrl = getPosterUrl;
  readonly getFullSynopsis = getFullSynopsis;
  readonly getDescription = getDescription;
  readonly formatDuration = formatDuration;
  readonly formatSeanceLabel = formatSeanceLabel;
  readonly resolveMediaUrl = resolveMediaUrl;
  readonly getMediaFilePath = getMediaFilePath;
  readonly handlePosterError = handlePosterError;
  readonly getGenreLabel = getGenreLabel;
  readonly getYearLabel = getYearLabel;
  readonly getDirectorLabel = getDirectorLabel;
  readonly getNationalityLabel = getNationalityLabel;
  readonly getActorsLabel = getActorsLabel;

  readonly images = computed(() => {
    const film = this.film();
    return film ? getImageMedias(film) : [];
  });
  readonly videos = computed(() => {
    const film = this.film();
    return film ? getVideoMedias(film) : [];
  });
  readonly documents = computed(() => {
    const film = this.film();
    return film ? getDocumentMedias(film) : [];
  });

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    });
  }

  close(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }

  onEscape(): void {
    this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  actorsLabel(film: Film): string {
    return getActorsLabel(film) || '—';
  }

  embedUrl(media: Media): SafeResourceUrl | null {
    const url = youtubeEmbedUrl(getMediaFilePath(media));
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }
}
