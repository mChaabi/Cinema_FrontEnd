// services/profile.ts
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UserProfile } from "../models/user-profile";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth";

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly baseUrl = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);
  private authService = inject(AuthService); // ✅ fuente única de verdad

  getCurrentUser(): Observable<UserProfile> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}`);
  }

  updateProfile(dto: Partial<UserProfile>): Observable<UserProfile> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}`, dto);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
    return this.http.put(`${this.baseUrl}/${userId}/password`, { currentPassword, newPassword });
  }
}