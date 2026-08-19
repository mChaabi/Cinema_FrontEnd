import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private router = inject(Router);

  searchQuery: string = '';
  selectedGenreId: number | string = ''; // Stocke l'ID du genre sélectionné
  unreadNotifications: number = 3;
  isProfileMenuOpen: boolean = false;

  // Données statiques pour les genres (similaires aux entités Genre de votre DB)
  genres = [
    { id: 1, nom: 'Action' },
    { id: 2, nom: 'Comédie' },
    { id: 3, nom: 'Drame' },
    { id: 4, nom: 'Horreur' },
    { id: 5, nom: 'Science-Fiction' },
    { id: 6, nom: 'Aventure' },
    { id: 7, nom: 'Animation' }
  ];

  currentUser = {
    name: 'Mohamed Chaabi',
    role: 'Administrateur',
    avatar: ''
  };

  onSearch(): void {
    console.log('Recherche :', this.searchQuery, '| Genre ID :', this.selectedGenreId);
  }

  onGenreChange(): void {
    console.log('Filtre genre changé :', this.selectedGenreId);}

  get firstName(): string {
    return this.currentUser.name.split(' ')[0] ?? this.currentUser.name;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // 3. Rediriger vers la page /login lors du logout
  logout(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}