import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Film } from '../models/film';
import { Salle } from '../models/salle';
import { Seance } from '../models/seance';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api'; // 👈 Quitamos /dashboard de aquí

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.baseUrl}/films`); // Apuntará a /api/films
  }

  getSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.baseUrl}/salles`); // Apuntará a /api/salles
  }

  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.baseUrl}/seances`); // Apuntará a /api/seances
  }

  getDashboardData(): Observable<any> {
    // Si prefieres usar el endpoint unificado del dashboard que creamos en Java:
    return this.http.get<any>(`${this.baseUrl}/dashboard`); 
    
    // O si prefieres mantener el forkJoin con llamadas separadas:
    /*
    return forkJoin({
      films: this.getFilms(),
      salles: this.getSalles(),
      seances: this.getSeances()
    });
    */
  }
}