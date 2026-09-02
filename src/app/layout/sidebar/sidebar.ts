import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  private authService = inject(AuthService);

  // ✅ Signal reactivo: solo se recalcula si currentUser cambia
  readonly isAdmin = computed(() => this.authService.isAdmin());

  // ✅ Signal memoizado: misma referencia mientras isAdmin() no cambie
  readonly menuGroups = computed<MenuGroup[]>(() => {
    const groups: MenuGroup[] = [];

    if (this.isAdmin()) {
      groups.push({
        title: 'GÉNÉRAL',
        items: [
          { label: 'Tableau de bord', icon: 'bi-grid-1x2', route: '/dashboard' }
        ]
      });
    }

    groups.push({
      title: 'CATALOGUE FILMS',
      items: [
        { label: "Films à l'affiche", icon: 'bi-film', route: '/films/a-laffiche' },
        { label: 'Prochainement', icon: 'bi-calendar-event', route: '/films/prochainement' }
      ]
    });

    // Genres solo ADMIN (gestión de catálogo) — muévelo arriba si debe ser público
    if (this.isAdmin()) {
      groups.push({
        title: 'GESTION',
        items: [
          { label: 'Genres & Origines', icon: 'bi-tags', route: '/genres' },
          { label: 'Salles', icon: 'bi-camera-reels', route: '/salles' }
        ]
      });
    }

    groups.push({
      title: 'MES BILLETS',
      items: [
        // sidebar.ts — dentro de MES BILLETS
        { label: 'Réserver un billet', icon: 'bi-ticket-perforated', route: 'films/a-laffiche' }, // ✅ manda al catálogo, no a una séance fija
        { label: 'Mes réservations', icon: 'bi-journal-check', route: 'reservations/historique' }
      ]
    });

    groups.push({
      title: 'COMPTE',
      items: [
        { label: 'Mon Profil & Rôle', icon: 'bi-person-badge', route: 'profile' }
      ]
    });

    return groups;
  });

  trackByRoute(_index: number, item: MenuItem): string {
    return item.route;
  }

  trackByTitle(_index: number, group: MenuGroup): string {
    return group.title;
  }
}