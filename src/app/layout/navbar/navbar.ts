import { Component, EventEmitter, inject, OnInit, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenreService } from '../../services/genre';
import { Genre } from '../../models/genre';
import { AuthService } from '../../services/auth';

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
  private genreService = inject(GenreService);
  private authService = inject(AuthService);

  searchQuery: string = '';
  selectedGenreId: number | string = '';
  unreadNotifications: number = 3;
  isProfileMenuOpen: boolean = false;

  genres: Genre[] = [];

  readonly currentUser = computed(() => this.authService.currentUser());

  readonly displayName = computed(() => this.currentUser()?.username ?? 'Invité');
  readonly displayRole = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' ? 'Administrateur' : role === 'USER' ? 'Utilisateur' : '';
  });

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.genreService.getAllGenres().subscribe({
      next: (data) => { this.genres = data; },
      error: (err) => console.error('Erreur chargement genres navbar', err)
    });
  }

  onSearch(): void {
    const queryParams: Record<string, string | number> = {};
    if (this.searchQuery?.trim()) queryParams['search'] = this.searchQuery.trim();
    if (this.selectedGenreId) queryParams['genreId'] = this.selectedGenreId;
    this.router.navigate(['/films/a-laffiche'], { queryParams });
  }

  onGenreChange(): void {
    this.onSearch();
  }

  get firstName(): string {
    return this.displayName().split(' ')[0] ?? this.displayName();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.authService.logout();
  }
}