import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  // Événement pour replier/déplier la Sidebar depuis le layout
  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery: string = '';
  unreadNotifications: number = 3;
  isProfileMenuOpen: boolean = false;

  currentUser = {
    name: 'Mohamed Chaabi',
    role: 'Administrateur',
    avatar: ''
  };

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche effectuée :', this.searchQuery);
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    console.log('Déconnexion en cours...');
  }
}