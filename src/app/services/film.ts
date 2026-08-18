import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/film'; // Vous pouvez typer avec le modèle ou un FilmDto équivalent
 
@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'http://localhost:8080/api/films';
 
  constructor(private http: HttpClient) {}
 
  getAllFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(this.apiUrl);
  }
 
  getFilmById(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/${id}`);
  }
 
  createFilm(film: Film): Observable<Film> {
    return this.http.post<Film>(this.apiUrl, film);
  }
 
  updateFilm(id: number, film: Film): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, film);
  }
 
  deleteFilm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}