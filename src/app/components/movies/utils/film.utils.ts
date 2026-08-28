import { Film } from '../../../models/film';
import { Genre } from '../../../models/genre';
import { Media, TypeMedia } from '../../../models/media';
import { Nationalite } from '../../../models/nationalite';
import { Personne, TypePersonne } from '../../../models/personne';
import { Seance } from '../../../models/seance';

export const CINEMA_API_ORIGIN = 'http://localhost:8080';

export const POSTER_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#g)"/>
      <text x="200" y="310" text-anchor="middle" fill="#E50914" font-size="72">🎬</text>
      <text x="200" y="370" text-anchor="middle" fill="#94a3b8" font-family="Segoe UI, sans-serif" font-size="22">Affiche indisponible</text>
    </svg>
  `.trim());

interface FilmLike extends Film {
  title?: string;
  duration?: number;
  year?: number;
  synopsis?: string;
  resume?: string;
  rating?: number;
  director?: Personne | string;
  actors?: Array<Personne | string>;
   photoUrl?: string;
}

export function filmKey(film: Film): string {
  return film.id != null ? String(film.id) : film.titre;
}

export function asTrimmedString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function resolveMediaUrl(path: string | undefined | null): string {
  if (!path?.trim()) {
    return POSTER_PLACEHOLDER;
  }

  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${CINEMA_API_ORIGIN}${trimmed}`;
  }

  if (!trimmed.includes('/')) {
    return `${CINEMA_API_ORIGIN}/uploads/${trimmed}`;
  }

  return `${CINEMA_API_ORIGIN}/${trimmed}`;
}

export function getMediaFilePath(media: Media | undefined | null): string {
  if (!media) {
    return '';
  }

  return asTrimmedString(media.media) || asTrimmedString(media.url) || asTrimmedString(media.chemin) || '';
}

export function getPosterUrl(film: Film): string {
  const direct =
    asTrimmedString(film.image) ||
    asTrimmedString(film.imageUrl) ||
    asTrimmedString(film.poster) ||
    asTrimmedString(film.posterUrl) ||
    asTrimmedString(film.affiche);
    asTrimmedString((film as FilmLike).photoUrl);

  if (direct) {
    return resolveMediaUrl(direct);
  }

  const images = getImageMedias(film);
  const fromImage = getMediaFilePath(images[0]);
  if (fromImage) {
    return resolveMediaUrl(fromImage);
  }

  const fallback = getMediaFilePath(film.medias?.[0]);
  return fallback ? resolveMediaUrl(fallback) : POSTER_PLACEHOLDER;
}

export function getImageMedias(film: Film): Media[] {
  return (film.medias ?? []).filter((media) => {
    const type = String(media.typeMedia ?? TypeMedia.IMAGE).toUpperCase();
    return type === TypeMedia.IMAGE || type === 'IMAGE';
  });
}

export function getVideoMedias(film: Film): Media[] {
  return (film.medias ?? []).filter(
    (media) => String(media.typeMedia ?? '').toUpperCase() === TypeMedia.VIDEO
  );
}

export function getDocumentMedias(film: Film): Media[] {
  return (film.medias ?? []).filter(
    (media) => String(media.typeMedia ?? '').toUpperCase() === TypeMedia.DOCUMENT
  );
}

export function formatDuration(minutes: number | undefined | null): string {
  if (minutes == null || minutes <= 0) {
    return '—';
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) {
    return `${remaining} min`;
  }

  if (remaining === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remaining} min`;
}

export function personFullName(personne: Personne | string | undefined | null): string {
  if (!personne) {
    return '';
  }

  if (typeof personne === 'string') {
    return personne.trim();
  }

  return [personne.prenom, personne.nom].filter(Boolean).join(' ').trim();
}

export function getGenreLabel(film: Film): string {
  const genre = film.genre as (Genre & { nom?: string; name?: string }) | string | undefined;
  if (!genre) {
    return '';
  }

  if (typeof genre === 'string') {
    return genre.trim();
  }

  return asTrimmedString(genre.libelle) || asTrimmedString(genre.nom) || asTrimmedString(genre.name) || '';
}

export function getNationalityLabel(film: Film): string {
  const nationality = film.nationalite as (Nationalite & { nom?: string; name?: string }) | string | undefined;
  if (!nationality) {
    return '';
  }

  if (typeof nationality === 'string') {
    return nationality.trim();
  }

  return (
    asTrimmedString(nationality.libelle) ||
    asTrimmedString(nationality.nom) ||
    asTrimmedString(nationality.name) ||
    ''
  );
}

export function getDirectorLabel(film: Film): string {
  return personFullName(film.realisateur) || personFullName((film as FilmLike).director);
}

export function getActorsLabel(film: Film): string {
  const actors = film.acteurs?.length ? film.acteurs : (film as FilmLike).actors;
  if (!actors?.length) {
    return '';
  }

  return actors.map((actor) => personFullName(actor)).filter(Boolean).join(', ');
}

export function getYearLabel(film: Film): string {
  return film.annee ? String(film.annee) : '';
}

export function getDescription(film: Film): string {
  return (
    asTrimmedString(film.description) ||
    asTrimmedString((film as FilmLike).synopsis) ||
    asTrimmedString((film as FilmLike).resume) ||
    ''
  );
}

export function getShortSynopsis(film: Film): string {
  const description = getDescription(film);
  if (description) {
    return description;
  }

  const parts = [getGenreLabel(film), getYearLabel(film), formatDuration(film.duree) !== '—' ? formatDuration(film.duree) : null].filter(
    (part): part is string => Boolean(part)
  );
  const director = getDirectorLabel(film) ? `Réalisé par ${getDirectorLabel(film)}.` : '';
  const lead = parts.length ? `${parts.join(' · ')}.` : '';

  return [lead, director].filter(Boolean).join(' ') || 'Fiche film à découvrir dans CineManager.';
}

export function getFullSynopsis(film: Film): string {
  const description = getDescription(film);
  if (description) {
    return description;
  }

  const title = film.titre ? `« ${film.titre} »` : 'Ce film';
  const genre = getGenreLabel(film) ? ` un film ${getGenreLabel(film).toLowerCase()}` : ' un film';
  const year = getYearLabel(film) ? ` sorti en ${getYearLabel(film)}` : '';
  const director = getDirectorLabel(film) ? `, réalisé par ${getDirectorLabel(film)}` : '';
  const duration = formatDuration(film.duree) !== '—' ? ` Durée : ${formatDuration(film.duree)}.` : '';
  const nationality = getNationalityLabel(film) ? ` Nationalité : ${getNationalityLabel(film)}.` : '';
  const cast = getActorsLabel(film) ? ` Avec ${getActorsLabel(film)}.` : '';

  return `${title} est${genre}${year}${director}.${duration}${nationality}${cast}`
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatSeanceDate(value: Date | string | undefined | null): string {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
}

export function formatSeanceTime(value: Date | string | undefined | null): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export function formatSeanceLabel(seance: Seance): string {
  const date = formatSeanceDate(seance.dateProjection);
  const start = formatSeanceTime(seance.heureDebut);
  const room = seance.salle ? `Salle ${seance.salle.numero}` : '';
  return [date, start, room].filter(Boolean).join(' · ');
}

export function youtubeEmbedUrl(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }

  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function handlePosterError(event: Event): void {
  const image = event.target as HTMLImageElement;
  if (!image.src.startsWith('data:image/svg+xml')) {
    image.src = POSTER_PLACEHOLDER;
  }
}

export function normalizeFilm(raw: Film): Film {
  const source = raw as FilmLike;
  const titre = asTrimmedString(source.titre) || asTrimmedString(source.title) || raw.titre;
  const description =
    asTrimmedString(source.description) || asTrimmedString(source.synopsis) || asTrimmedString(source.resume);
  const image =
    asTrimmedString(source.image) ||
    asTrimmedString(source.imageUrl) ||
    asTrimmedString(source.poster) ||
    asTrimmedString(source.posterUrl) ||
    asTrimmedString(source.affiche);
     asTrimmedString(source.photoUrl);
  const note = source.note ?? source.rating;
  const annee = source.annee ?? source.year ?? raw.annee;
  const duree = source.duree ?? source.duration ?? raw.duree;
  const genre = normalizeGenre(source.genre);
  const nationalite = normalizeNationalite(source.nationalite);
  const realisateur = normalizePersonne(source.realisateur ?? source.director, TypePersonne.REALISATEUR);
  const acteurs = normalizePersonnes(source.acteurs ?? source.actors, TypePersonne.ACTEUR);
  const medias = normalizeMedias(source.medias, image);

  return {
    ...raw,
    titre,
    duree,
    annee,
    description,
    image,
    imageUrl: source.imageUrl || image,
    poster: source.poster || image,
    posterUrl: source.posterUrl || image,
    affiche: source.affiche || image,
    note,
    genre,
    nationalite,
    realisateur,
    acteurs,
    medias
  };
}

export function mergeFilms(base: Film, incoming: Film): Film {
  const left = normalizeFilm(base);
  const right = normalizeFilm(incoming);

  return normalizeFilm({
    ...left,
    ...right,
    titre: right.titre || left.titre,
    duree: right.duree || left.duree,
    annee: right.annee || left.annee,
    description: right.description || left.description,
    image: right.image || left.image,
    imageUrl: right.imageUrl || left.imageUrl,
    poster: right.poster || left.poster,
    posterUrl: right.posterUrl || left.posterUrl,
    affiche: right.affiche || left.affiche,
    note: right.note ?? left.note,
    genre: right.genre ?? left.genre,
    nationalite: right.nationalite ?? left.nationalite,
    realisateur: right.realisateur ?? left.realisateur,
    acteurs: right.acteurs?.length ? right.acteurs : left.acteurs,
    medias: right.medias?.length ? right.medias : left.medias,
    seances: right.seances?.length ? right.seances : left.seances
  });
}

export function matchesFilmQuery(film: Film, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [film.titre, getDescription(film)].join(' ').toLowerCase();

  return haystack.includes(needle);
}

function normalizeGenre(value: Genre | string | undefined): Genre | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return { libelle: value };
  }

  return value;
}

function normalizeNationalite(value: Nationalite | string | undefined): Nationalite | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return { libelle: value };
  }

  return value;
}

function normalizePersonne(
  value: Personne | string | undefined,
  typePersonne: TypePersonne
): Personne | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    const parts = value.trim().split(/\s+/);
    const nom = parts.pop() ?? value;
    const prenom = parts.join(' ');
    return { prenom, nom, typePersonne };
  }

  return value;
}

function normalizePersonnes(
  values: Array<Personne | string> | undefined,
  typePersonne: TypePersonne
): Personne[] | undefined {
  if (!values?.length) {
    return undefined;
  }

  return values
    .map((value) => normalizePersonne(value, typePersonne))
    .filter((value): value is Personne => Boolean(value));
}

function normalizeMedias(medias: Media[] | undefined, poster: string | undefined): Media[] | undefined {
  const normalized = (medias ?? []).map((media) => ({
    ...media,
    media: getMediaFilePath(media) || media.media
  }));

  if (poster && !normalized.some((media) => getMediaFilePath(media) === poster)) {
    normalized.unshift({ media: poster, typeMedia: TypeMedia.IMAGE });
  }

  return normalized.length ? normalized : undefined;
}
