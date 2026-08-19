import { Injectable, signal } from '@angular/core';
import { FilmReview, NewFilmReview } from './film-review.model';

const MOCK_REVIEWS: FilmReview[] = [
  {
    id: 'rev-1',
    filmId: '1',
    author: 'Marie L.',
    rating: 5,
    comment:
      'Un chef-d’œuvre visuel et narratif. La bande-son et les effets spéciaux restent impressionnants même aujourd’hui.',
    createdAt: new Date('2025-11-12T18:30:00')
  },
  {
    id: 'rev-2',
    filmId: '1',
    author: 'Thomas B.',
    rating: 4,
    comment:
      'Très bon film, un peu dense au premier visionnage mais largement gratifiant à revoir.',
    createdAt: new Date('2026-01-08T14:15:00')
  },
  {
    id: 'rev-3',
    filmId: '2',
    author: 'Sophie R.',
    rating: 5,
    comment:
      'Émotionnellement puissant. Une expérience cinématographique mémorable du début à la fin.',
    createdAt: new Date('2026-02-20T20:00:00')
  }
];

@Injectable({ providedIn: 'root' })
export class FilmReviewsService {
  private readonly reviews = signal<FilmReview[]>([...MOCK_REVIEWS]);
  private nextId = MOCK_REVIEWS.length + 1;

  readonly allReviews = this.reviews.asReadonly();

  addReview(filmId: string, payload: NewFilmReview): FilmReview {
    const review: FilmReview = {
      id: `rev-${this.nextId++}`,
      filmId,
      author: payload.author.trim(),
      rating: Math.min(5, Math.max(1, Math.round(payload.rating))),
      comment: payload.comment.trim(),
      createdAt: new Date()
    };

    this.reviews.update((current) => [...current, review]);
    return review;
  }
}
