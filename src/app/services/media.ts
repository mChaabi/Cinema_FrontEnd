import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '../models/media';
 
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = 'http://localhost:8080/api/medias';
 
  constructor(private http: HttpClient) {}
 
  getAllMedias(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiUrl);
  }
 
  getMediaById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }
 
  createMedia(media: Media): Observable<Media> {
    return this.http.post<Media>(this.apiUrl, media);
  }
 
  updateMedia(id: number, media: Media): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, media);
  }
 
  deleteMedia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadMedia(file: File, filmId: number, typeMedia: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filmId', filmId.toString());
  formData.append('typeMedia', typeMedia);
  return this.http.post(`${this.apiUrl}/upload`, formData);
}
}