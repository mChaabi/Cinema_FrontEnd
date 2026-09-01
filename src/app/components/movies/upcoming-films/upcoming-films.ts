import { ChangeDetectionStrategy, Component, computed, inject, signal, afterNextRender } from '@angular/core';
import { FilmCardComponent } from '../film-card/film-card';
import { FilmService } from '../../../services/film';
import { Film } from '../../../models/film';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-upcoming-films',
  standalone: true,
  imports: [FilmCardComponent,DatePipe],
  templateUrl: './upcoming-films.html',
  styleUrl: './upcoming-films.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingFilmsComponent {
  private readonly filmService = inject(FilmService);
  readonly allFilms = signal<Film[]>([]);
  readonly isLoading = signal(true);

  readonly upcomingFilms = computed(() => {
    const today = new Date();
    return this.allFilms()
      // .filter((film) => film.dateSortie && new Date(film.dateSortie) > today)
      // .sort((a, b) => new Date(a.dateSortie!).getTime() - new Date(b.dateSortie!).getTime());
  });

  constructor() {
    afterNextRender(() => this.load());
  }

  load(): void {
    this.filmService.getAllFilms().subscribe((films) => {
      this.allFilms.set(films);
      this.isLoading.set(false);
    });
  }

  daysUntilRelease(dateSortie: string): number {
    const diff = new Date(dateSortie).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Almacena los IDs de las películas por las que el usuario pidió notificación
  readonly notifiedFilmIds = signal<number[]>([]);

  // Comprueba si una película ya fue marcada para notificación
  isNotified(filmId: number): boolean {
    return this.notifiedFilmIds().includes(filmId);
  }

  // Activa la notificación para una película
  notifyMe(filmId: number): void {
    if (!this.isNotified(filmId)) {
      this.notifiedFilmIds.update(ids => [...ids, filmId]);
    }
  }
}