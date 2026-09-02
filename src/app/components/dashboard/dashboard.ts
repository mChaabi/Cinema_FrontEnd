import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Film } from '../../models/film';
import { Salle } from '../../models/salle';
import { Seance } from '../../models/seance';
import { Genre } from '../../models/genre';
import { DashboardService } from '../../services/dashboard';
import { GenreService } from '../../services/genre';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private genreService = inject(GenreService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;

  films: Film[] = [];
  salles: Salle[] = [];
  seances: Seance[] = [];
  allGenres: Genre[] = [];

  totalReservations = 0;
  totalBilletsVendus = 0;
  occupationParSalle: Record<string, number> = {};

  stats = [
    { title: 'Films actifs', value: '0', change: 'En salle', positive: true, icon: 'bi-film' },
    { title: 'Salles disponibles', value: '0', change: 'Total', positive: true, icon: 'bi-projector' },
    { title: 'Séances programmées', value: '0', change: "Aujourd'hui", positive: true, icon: 'bi-calendar-event' },
    { title: 'Réservations', value: '0', change: 'Total', positive: true, icon: 'bi-journal-check' },
    { title: 'Billets vendus', value: '0', change: 'Total', positive: true, icon: 'bi-ticket-perforated' }
  ];

  // ---- Donut chart : répartition par genre ----
  genreChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  genreChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#f8fafc', font: { size: 12 } }
      }
    },
    cutout: '65%'
  };

  // ---- Bar chart : films par genre ----
  filmsChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Films', backgroundColor: '#e11d48' }] };
  filmsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.isLoading && this.films.length > 0) return;
    this.isLoading = true;
    console.log('Starting dashboard data load...');

    forkJoin({
      dashboard: this.dashboardService.getDashboardData().pipe(
        catchError(err => {
          console.error('Error fetching dashboard:', err);
          return of(null);
        })
      ),
      genres: this.genreService.getAllGenres().pipe(
        catchError(err => {
          console.error('Error fetching genres:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (res) => {
        console.log('📦 RESPUESTA COMPLETA DEL BACKEND:', res);

        let filmsCount = 0;
        let sallesCount = 0;
        let seancesCount = 0;

        if (res.dashboard) {
          this.films = res.dashboard.films || [];
          this.salles = res.dashboard.salles || [];
          this.seances = res.dashboard.seances || [];
          this.totalReservations = res.dashboard.totalReservations || 0;
          this.totalBilletsVendus = res.dashboard.totalBilletsVendus || 0;
          this.occupationParSalle = res.dashboard.occupationParSalle || {};

          filmsCount = this.films.length;
          sallesCount = this.salles.length;
          seancesCount = this.seances.length;
        }

        this.allGenres = res.genres || [];

        // 💡 Actualizamos dinámicamente las tarjetas de estadísticas con datos reales
        this.stats = [
          { title: 'Films actifs', value: filmsCount.toString(), change: 'En salle', positive: true, icon: 'bi-film' },
          { title: 'Salles disponibles', value: sallesCount.toString(), change: 'Total', positive: true, icon: 'bi-projector' },
          { title: 'Séances programmées', value: seancesCount.toString(), change: "Aujourd'hui", positive: true, icon: 'bi-calendar-event' },
          { title: 'Réservations', value: this.totalReservations.toString(), change: 'Total', positive: true, icon: 'bi-journal-check' },
          { title: 'Billets vendus', value: this.totalBilletsVendus.toString(), change: 'Total', positive: true, icon: 'bi-ticket-perforated' }
        ];

        this.buildCharts();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Critical error in forkJoin:', err);
        this.isLoading = false;
      }
    });
  }
  private buildCharts(): void {
    const colors = ['#e11d48', '#3b82f6', '#eab308', '#10b981', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

    // Creamos un mapa para contar cuántas películas hay por cada ID de género
    const genreCountMap = new Map<number, number>();

    // Inicializar todos los IDs de géneros conocidos a 0
    if (this.allGenres && Array.isArray(this.allGenres)) {
      this.allGenres.forEach((g: any) => {
        genreCountMap.set(g.id, 0);
      });
    }

    // Contar las películas reales recorriendo this.films
    if (this.films && Array.isArray(this.films)) {
      this.films.forEach((film: any) => {
        // Intentamos extraer el ID del género de cualquier forma posible en la que venga el objeto
        let genreId: number | null = null;

        if (film.genre) {
          if (typeof film.genre === 'number') {
            genreId = film.genre;
          } else if (typeof film.genre === 'object' && film.genre.id) {
            genreId = film.genre.id;
          }
        } else if (film.genreId) {
          genreId = film.genreId;
        } else if (film.idGenre) {
          genreId = film.idGenre;
        }

        // Si encontramos un ID válido, sumamos al contador de ese género
        if (genreId !== null && genreCountMap.has(genreId)) {
          genreCountMap.set(genreId, (genreCountMap.get(genreId) || 0) + 1);
        }
      });
    }

    // Construir las etiquetas (labels) y los datos (data) usando los nombres reales de los géneros
    const labels: string[] = [];
    const dataCounts: number[] = [];

    if (this.allGenres && Array.isArray(this.allGenres)) {
      this.allGenres.forEach((g: any) => {
        labels.push(g.libelle);
        dataCounts.push(genreCountMap.get(g.id) || 0);
      });
    }

    this.genreChartData = {
      labels: labels,
      datasets: [
        {
          data: dataCounts,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 0
        }
      ]
    };

    this.filmsChartData = {
      labels: labels,
      datasets: [
        {
          data: dataCounts,
          label: 'Films',
          backgroundColor: '#e11d48',
          borderRadius: 6
        }
      ]
    };
  }
  occupationOf(salle: Salle): number {
    return this.occupationParSalle[salle.id!] ?? 0;
  }
}