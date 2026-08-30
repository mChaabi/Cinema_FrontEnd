import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserProfile } from "../models/user-profile";

// services/profile.service.ts
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly baseUrl = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}

  getCurrentUser() {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  updateProfile(changes: Partial<UserProfile>) {
    return this.http.put<UserProfile>(`${this.baseUrl}/me`, changes);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<void>(`${this.baseUrl}/me/password`, { currentPassword, newPassword });
  }
}