import { Nationalite } from './nationalite';
import { Film } from './film';

// Définition de l'Enum pour correspondre exactement à TypePersonne
export enum TypePersonne {
  ACTEUR = 'ACTEUR',
  REALISATEUR = 'REALISATEUR'
}

export interface Personne {
  id?: number;                  // Hérité de AbstractModel (identifiant unique)
  nom: string;                  // Nom de famille (max 50 caractères)
  prenom: string;               // Prénom (max 50 caractères)
  photo?: string;               // Lien ou chemin vers la photo (max 100 caractères)
  dateNaissance?: Date;         // Date de naissance
  typePersonne: TypePersonne;   // Type (ACTEUR ou REALISATEUR)
  addedDate?: Date;             // Date d'ajout en base
  nationalite?: Nationalite;    // Objet Nationalite associé (ManyToOne)
  films?: Film[];               // Liste des films dans lesquels la personne est acteur (ManyToMany)
  filmsRealises?: Film[];       // Liste des films réalisés par cette personne (OneToMany)
}