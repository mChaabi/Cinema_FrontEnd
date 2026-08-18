import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personne } from '../models/personne';
 
@Injectable({
  providedIn: 'root'
})
export class PersonneService {
  private apiUrl = 'http://localhost:8080/api/personnes';
 
  constructor(private http: HttpClient) {}
 
  getAllPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>(this.apiUrl);
  }
 
  getPersonneById(id: number): Observable<Personne> {
    return this.http.get<Personne>(`${this.apiUrl}/${id}`);
  }
 
  createPersonne(personne: Personne): Observable<Personne> {
    return this.http.post<Personne>(this.apiUrl, personne);
  }
 
  updatePersonne(id: number, personne: Personne): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, personne);
  }
 
  deletePersonne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}