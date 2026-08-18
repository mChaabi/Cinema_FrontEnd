import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Film } from '../../models/film';
import { Salle } from '../../models/salle';
import { Seance } from '../../models/seance';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  isLoading = true;

  films: Film[] = [];
  salles: Salle[] = [];
  seances: Seance[] = [];

  stats = [
    { title: 'Films actifs', value: '0', change: 'En salle', positive: true, icon: 'bi-film' },
    { title: 'Salles disponibles', value: '0', change: 'Total', positive: true, icon: 'bi-projector' },
    { title: 'Séances programmées', value: '0', change: 'Aujourd\'hui', positive: true, icon: 'bi-calendar-event' },
    { title: 'Taux d\'occupation', value: '75%', change: '+2.4%', positive: true, icon: 'bi-people' }
  ];

  genreStats: { name: string; count: number; percentage: number; color: string }[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.films = data.films || [];
        this.salles = data.salles || [];
        this.seances = data.seances || [];

        // 1. Mise à jour des cartes KPI
        this.stats[0].value = this.films.length.toString();
        this.stats[1].value = this.salles.length.toString();
        this.stats[2].value = this.seances.length.toString();

        // 2. Calcul dynamique des genres
        this.calculateGenreStats();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données :', err);
        this.isLoading = false;
      }
    });
  }

  private calculateGenreStats(): void {
    if (!this.films || this.films.length === 0) {
      this.genreStats = [];
      return;
    }

    const totalFilms = this.films.length;
    const colors = ['#e11d48', '#3b82f6', '#eab308', '#10b981', '#8b5cf6'];
    const genreMap = new Map<string, number>();

    // Extraction et comptage automatique des genres depuis les films
    this.films.forEach(film => {
      const genreNom = film.genre?.libelle || 'Autre';
      genreMap.set(genreNom, (genreMap.get(genreNom) || 0) + 1);
    });

    let index = 0;
    this.genreStats = Array.from(genreMap.entries()).map(([name, count]) => {
      const percentage = Math.round((count / totalFilms) * 100);
      const color = colors[index % colors.length];
      index++;

      return { name, count, percentage, color };
    });
  }
}