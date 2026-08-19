export interface FilmReview {
  id: string;
  filmId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface NewFilmReview {
  author: string;
  rating: number;
  comment: string;
}
