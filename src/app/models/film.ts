import { Genre } from './genre';
import { Nationalite } from './nationalite';
import { Personne } from './personne';
import { Media } from './media';
import { Seance } from './seance';

export interface Film {
  id?: number;                  // Hérité de AbstractModel (identifiant unique)
  titre: string;                // Titre du film (obligatoire, max 50 caractères)
  duree: number;                // Durée du film en minutes
  annee: number;                // Année de sortie du film
  genre?: Genre;                // Objet Genre associé (ManyToOne)
  nationalite?: Nationalite;    // Objet Nationalite associé (ManyToOne)
  realisateur?: Personne;       // Réalisateur du film (Personne liée via DIRECTOR_ID)
  acteurs?: Personne[];         // Liste des acteurs du film (ManyToMany)
  seances?: Seance[];           // Liste des séances associées (OneToMany)
  medias?: Media[];             // Liste des médias / affiches associés (OneToMany)
  addedDate?: Date;             // Date d'ajout en base de données
}