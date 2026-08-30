import { ChangeDetectionStrategy, Component, inject, signal, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { GenreService } from '../../../services/genre'; // <-- Asegúrate de que la ruta sea correcta hacia tu servicio
import { Genre } from '../../../models/genre';

@Component({
  selector: 'app-genres',
  standalone: true,
  templateUrl: './genres.html',
  styleUrl: './genres.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenresComponent {
  private readonly genreService = inject(GenreService);
  private readonly router = inject(Router);

  readonly genres = signal<Genre[]>([]);
  readonly isLoading = signal(true);

  constructor() {
    afterNextRender(() => this.loadGenres());
  }

  loadGenres(): void {
    this.genreService.getAllGenres().subscribe({
      next: (data) => {
        this.genres.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des genres', err);
        this.isLoading.set(false);
      }
    });
  }

  goToGenre(genreLibelle: string): void {
    this.router.navigate(['/films/a-laffiche'], { queryParams: { genre: genreLibelle } });
  }

  getGenreImage(libelle: string): string {
  const images: { [key: string]: string } = {
    'Science-Fiction': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    'Action': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    'Drame': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop',
    'Comédie': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop'
  };
  
  // Si encuentra la imagen la usa, si no, usa una por defecto de cine
  return images[libelle] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
}
}