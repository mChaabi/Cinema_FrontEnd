import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule ,FormsModule ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  // Structure du menu pour l'interface Utilisateur
  menuGroups = [
    {
      title: 'GÉNÉRAL',
      items: [
        { label: 'Tableau de bord', icon: 'bi-grid-1x2', route: '/dashboard' }
      ]
    },
    {
      title: 'CATALOGUE FILMS',
      items: [
        { label: 'Films à l\'affiche', icon: 'bi-film', route: '/films/a-laffiche' },
        { label: 'Prochainement', icon: 'bi-calendar-event', route: '/films/prochainement' },
        { label: 'Genres & Origines', icon: 'bi-tags', route: '/films/genres' }
      ]
    },
    {
      title: 'MES BILLETS',
      items: [
        { label: 'Réserver un billet', icon: 'bi-ticket-perforated', route: '/reservations/nouvelle' },
        { label: 'Mes réservations', icon: 'bi-journal-check', route: '/reservations/historique' }
      ]
    },
    {
      title: 'COMPTE',
      items: [
        { label: 'Mon Profil & Rôle', icon: 'bi-person-badge', route: '/profile' }
      ]
    }
  ];
}