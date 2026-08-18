import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Film } from '../models/film';
import { Salle } from '../models/salle';
import { Seance } from '../models/seance';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  // 🟢 MODE DESIGN : 'true' pour utiliser les données statiques sans appeler le Backend
  // 🔴 MODE PROD : 'false' quand le Backend Spring Boot est démarré
  private useMockData = true;

  // Données statiques d'essai
  private mockFilms: Film[] = [
    { id: 1, titre: 'Inception', genre: { id: 1, nom: 'Science-Fiction' } },
    { id: 2, titre: 'Oppenheimer', genre: { id: 2, nom: 'Drame' } },
    { id: 3, titre: 'Dune: Partie 2', genre: { id: 1, nom: 'Science-Fiction' } },
    { id: 4, titre: 'The Dark Knight', genre: { id: 3, nom: 'Action' } }
  ] as any[];

  private mockSalles: Salle[] = [
    { id: 1, numero: 1, capacite: 250 },
    { id: 2, numero: 2, capacite: 80 },
    { id: 3, numero: 3, capacite: 150 }
  ] as any[];

  private mockSeances: Seance[] = [
    { id: 1, date: '2026-08-18', heureDebut: '18:30' },
    { id: 2, date: '2026-08-18', heureDebut: '21:00' }
  ] as any[];

  getFilms(): Observable<Film[]> {
    if (this.useMockData) {
      return of(this.mockFilms); // Aucun appel HTTP direct
    }
    return this.http.get<Film[]>(`${this.baseUrl}/films`).pipe(
      catchError(() => of(this.mockFilms))
    );
  }

  getSalles(): Observable<Salle[]> {
    if (this.useMockData) {
      return of(this.mockSalles);
    }
    return this.http.get<Salle[]>(`${this.baseUrl}/salles`).pipe(
      catchError(() => of(this.mockSalles))
    );
  }

  getSeances(): Observable<Seance[]> {
    if (this.useMockData) {
      return of(this.mockSeances);
    }
    return this.http.get<Seance[]>(`${this.baseUrl}/seances`).pipe(
      catchError(() => of(this.mockSeances))
    );
  }

  getDashboardData(): Observable<any> {
    return forkJoin({
      films: this.getFilms(),
      salles: this.getSalles(),
      seances: this.getSeances()
    });
  }
}