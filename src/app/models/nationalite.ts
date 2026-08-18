import { Personne } from './personne';

export interface Nationalite {
  id?: number;         // Hérité de AbstractModel (identifiant unique)
  libelle: string;     // Nom de la nationalité / pays (max 50 caractères)
  personnes?: Personne[]; // Liste des personnes associées à cette nationalité (OneToMany)
}