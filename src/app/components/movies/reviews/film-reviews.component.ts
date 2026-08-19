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
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Film } from '../../../models/film';
import { FilmReviewsService } from './film-reviews.service';
import { formatReviewDate } from './review-date.utils';
import { ReviewStarInputComponent } from './review-star-input.component';

function resolveFilmId(film: Film): string {
  return film.id != null ? String(film.id) : film.titre;
}

@Component({
  selector: 'app-film-reviews',
  standalone: true,
  imports: [FormsModule, ReviewStarInputComponent],
  templateUrl: './film-reviews.component.html',
  styleUrl: './film-reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class FilmReviewsComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reviewsService = inject(FilmReviewsService);

  readonly film = input<Film | null>(null);
  readonly isOpen = input(false);
  readonly closed = output<void>();

  readonly author = signal('');
  readonly rating = signal(0);
  readonly comment = signal('');
  readonly formError = signal<string | null>(null);
  readonly submitSuccess = signal(false);

  readonly filmId = computed(() => {
    const current = this.film();
    return current ? resolveFilmId(current) : '';
  });

  readonly reviews = computed(() => {
    const id = this.filmId();
    if (!id) {
      return [];
    }

    return this.reviewsService
      .allReviews()
      .filter((review) => review.filmId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  readonly reviewCount = computed(() => this.reviews().length);
  readonly formatReviewDate = formatReviewDate;

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });

    effect(() => {
      if (this.isOpen()) {
        this.resetForm();
      }
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

  onAuthorInput(event: Event): void {
    this.author.set((event.target as HTMLInputElement).value);
    this.formError.set(null);
  }

  onCommentInput(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
    this.formError.set(null);
  }

  submitReview(): void {
    const filmId = this.filmId();
    const author = this.author().trim();
    const rating = this.rating();
    const comment = this.comment().trim();

    if (!filmId) {
      return;
    }

    if (!author) {
      this.formError.set('Veuillez indiquer votre nom ou pseudo.');
      return;
    }

    if (rating < 1) {
      this.formError.set('Veuillez attribuer une note entre 1 et 5 étoiles.');
      return;
    }

    if (comment.length < 10) {
      this.formError.set('Votre avis doit contenir au moins 10 caractères.');
      return;
    }

    this.reviewsService.addReview(filmId, { author, rating, comment });
    this.resetForm();
    this.submitSuccess.set(true);

    setTimeout(() => this.submitSuccess.set(false), 2800);
  }

  private resetForm(): void {
    this.author.set('');
    this.rating.set(0);
    this.comment.set('');
    this.formError.set(null);
    this.submitSuccess.set(false);
  }
}
