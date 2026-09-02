import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, timeout } from 'rxjs';
import { Film } from '../../models/film';
import { Seance } from '../../models/seance';
import { FilmService } from '../../services/film';
import { SeanceService } from '../../services/seance';
import { FilmCarouselComponent } from './film-carousel/film-carousel';
import { FilmCardComponent } from './film-card/film-card';
import { FilmDetailsModalComponent } from './film-details-modal/film-details-modal';
import { FilmReviewsComponent } from './reviews/film-reviews.component';
import { getFallbackFilms } from './utils/film.fallback';
import { filmKey, getGenreLabel, matchesFilmQuery, mergeFilms, normalizeFilm } from './utils/film.utils';
import { ReservationStateService } from '../reservations/services/reservation-state';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [FilmCarouselComponent, FilmCardComponent, FilmDetailsModalComponent, FilmReviewsComponent],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent {
  private readonly filmService = inject(FilmService);
  private readonly seanceService = inject(SeanceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private reservationState = inject(ReservationStateService);
  private router = inject(Router);

  readonly films = signal<Film[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedFilm = signal<Film | null>(null);
  readonly isModalOpen = signal(false);
  readonly reviewsFilm = signal<Film | null>(null);
  readonly isReviewsOpen = signal(false);
  readonly searchQuery = signal('');
  readonly selectedGenre = signal('all');
  readonly selectedYear = signal('all');
  readonly filmKey = filmKey;

  readonly selectedFilmId = signal<number | null>(null);
  readonly seances = signal<Seance[]>([]);

  readonly featuredFilms = computed(() => this.films().slice(0, 5));

  readonly genreOptions = computed(() => {
    const labels = this.films().map(film => getGenreLabel(film)).filter(Boolean);
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b, 'fr'));
  });

  readonly yearOptions = computed(() => {
    const years = this.films()
      .map((film) => film.annee)
      .filter((year): year is number => year != null && year > 0);
    return [...new Set(years)].sort((a, b) => b - a);
  });

  readonly isReservationView = computed(() => {
    const url = this.router.url.toLowerCase();
    // Añadimos 'films' o 'a-laffiche' para que también se muestre aquí
    return url.includes('reservations') || url.includes('reserver') || url.includes('billet') || url.includes('films');
  });

  readonly filteredFilms = computed(() => {
    const query = this.searchQuery();
    const genre = this.selectedGenre();
    const year = this.selectedYear();

    return this.films().filter((film) => {
      if (genre !== 'all' && getGenreLabel(film) !== genre) {
        return false;
      }
      if (year !== 'all' && String(film.annee) !== year) {
        return false;
      }
      return matchesFilmQuery(film, query);
    });
  });

  readonly hasActiveFilters = computed(
    () => this.searchQuery().trim().length > 0 || this.selectedGenre() !== 'all' || this.selectedYear() !== 'all'
  );

  readonly resultCount = computed(() => this.filteredFilms().length);

  constructor() {
    afterNextRender(() => this.loadFilms());

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['search'] !== undefined) {
        this.searchQuery.set(params['search']);
      }
      if (params['genre'] !== undefined) {
        this.selectedGenre.set(params['genre']);
      }
      if (params['genreId'] !== undefined) {
        this.selectedGenre.set(params['genreId']);
      }
    });
  }

  loadFilms(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.filmService
      .getAllFilms()
      .pipe(
        timeout(8000),
        map((films) => films.map((film) => normalizeFilm(film))),
        catchError(() => of(getFallbackFilms().map((film) => normalizeFilm(film)))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((films) => {
        this.films.set(films);
        this.isLoading.set(false);
      });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onGenreChange(event: Event): void {
    this.selectedGenre.set((event.target as HTMLSelectElement).value);
  }

  verSeances(film: Film): void {
    if (film.id == null) return;

    if (this.selectedFilmId() === film.id) {
      this.selectedFilmId.set(null);
      return;
    }

    this.selectedFilmId.set(film.id);
    this.seanceService.getSeancesByFilm(film.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.seances.set(data));
  }

  reserver(seance: Seance, filmTitle: string): void {
    if (seance.id != null) {
      this.reservationState.setSeance(seance.id, filmTitle);
      this.router.navigate(['/reservations/nouvelle', seance.id]);
    }
  }

  onYearChange(event: Event): void {
    this.selectedYear.set((event.target as HTMLSelectElement).value);
  }

  selectGenre(genre: string): void {
    this.selectedGenre.set(genre);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedGenre.set('all');
    this.selectedYear.set('all');
  }

  onViewDetails(film: Film): void {
    this.selectedFilm.set(film);
    this.isModalOpen.set(true);

    if (film.id == null) {
      return;
    }

    this.filmService
      .getFilmById(film.id)
      .pipe(
        timeout(8000),
        map((fullFilm) => mergeFilms(film, fullFilm)),
        catchError(() => of(film)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((fullFilm) => this.selectedFilm.set(fullFilm));
  }

  onModalClosed(): void {
    this.isModalOpen.set(false);
    this.selectedFilm.set(null);
  }

  onViewReviews(film: Film): void {
    this.reviewsFilm.set(film);
    this.isReviewsOpen.set(true);
  }

  onReviewsClosed(): void {
    this.isReviewsOpen.set(false);
    this.reviewsFilm.set(null);
  }
}