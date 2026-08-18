import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre';
 
@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl = 'http://localhost:8080/api/genres';
 
  constructor(private http: HttpClient) {}
 
  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }
 
  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/${id}`);
  }
 
  createGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre);
  }
 
  updateGenre(id: number, genre: Genre): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, genre);
  }
 
  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}