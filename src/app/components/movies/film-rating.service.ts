import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'cine-manager.film-ratings';

@Injectable({
  providedIn: 'root'
})
export class FilmRatingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ratings = signal<Record<string, number>>({});

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restore();

      effect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ratings()));
      });
    }
  }

  getRating(filmKey: string): number {
    const value = this.ratings()[filmKey];
    return value ?? 0;
  }

  setRating(filmKey: string, rating: number): void {
    const clamped = Math.min(5, Math.max(0, Math.round(rating)));
    this.ratings.update((current) => ({ ...current, [filmKey]: clamped }));
  }

  private restore(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, number>;
      if (parsed && typeof parsed === 'object') {
        this.ratings.set(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
