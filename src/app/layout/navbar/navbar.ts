import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GenreService } from '../../services/genre';
import { Genre } from '../../models/genre';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private genreService = inject(GenreService);

  searchQuery: string = '';
  selectedGenreId: number | string = '';
  unreadNotifications: number = 3;
  isProfileMenuOpen: boolean = false;

  genres: Genre[] = [];

  currentUser = {
    name: 'Mohamed Chaabi',
    role: 'Administrateur',
    avatar: ''
  };

  ngOnInit(): void {
    this.loadGenres();
    this.syncWithQueryParams();
  }

  loadGenres(): void {
    this.genreService.getAllGenres().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (err) => {
        console.error('Erreur chargement genres navbar', err);
      }
    });
  }

  /**
   * Synchronise la barre de recherche et le sélecteur de genre
   * avec les Query Parameters présents dans l'URL
   */
  syncWithQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search'] !== undefined) {
        this.searchQuery = params['search'];
      }
      if (params['genreId'] !== undefined) {
        this.selectedGenreId = params['genreId'];
      }
    });
  }

  /**
   * Méthode unique pour exécuter la recherche combinée
   */
  triggerSearch(): void {
    const queryParams: Record<string, string | number> = {};

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      queryParams['search'] = this.searchQuery.trim();
    }

    if (this.selectedGenreId) {
      queryParams['genreId'] = this.selectedGenreId;
    }

    this.router.navigate(['/films/a-laffiche'], { queryParams });
  }

  onSearch(): void {
    this.triggerSearch();
  }

  onGenreChange(): void {
    this.triggerSearch();
  }

  get firstName(): string {
    return this.currentUser.name.split(' ')[0] ?? this.currentUser.name;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}