import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Seance } from '../models/seance';
 
@Injectable({

  providedIn: 'root'

})

export class SeanceService {

  private apiUrl = 'http://localhost:8080/api/seances';
 
  constructor(private http: HttpClient) {}
 
  getAllSeances(): Observable<Seance[]> {

    return this.http.get<Seance[]>(this.apiUrl);

  }
 
  getSeanceById(id: number): Observable<Seance> {

    return this.http.get<Seance>(`${this.apiUrl}/${id}`);

  }
 
  createSeance(seance: Seance): Observable<Seance> {

    return this.http.post<Seance>(this.apiUrl, seance);

  }
 
  updateSeance(id: number, seance: Seance): Observable<void> {

    return this.http.put<void>(`${this.apiUrl}/${id}`, seance);

  }
 
  deleteSeance(id: number): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}/${id}`);

  }

}
 