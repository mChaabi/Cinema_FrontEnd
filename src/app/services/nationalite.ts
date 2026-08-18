import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nationalite } from '../models/nationalite';
 
@Injectable({
  providedIn: 'root'
})
export class NationaliteService {
  private apiUrl = 'http://localhost:8080/api/nationalites';
 
  constructor(private http: HttpClient) {}
 
  getAllNationalites(): Observable<Nationalite[]> {
    return this.http.get<Nationalite[]>(this.apiUrl);
  }
 
  getNationaliteById(id: number): Observable<Nationalite> {
    return this.http.get<Nationalite>(`${this.apiUrl}/${id}`);
  }
 
  createNationalite(nationalite: Nationalite): Observable<Nationalite> {
    return this.http.post<Nationalite>(this.apiUrl, nationalite);
  }
 
  updateNationalite(id: number, nationalite: Nationalite): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, nationalite);
  }
 
  deleteNationalite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}