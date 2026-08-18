import { Film } from './film';

export interface Genre {
  id?: number;         // Hérité de AbstractModel (identifiant unique)
  libelle: string;     // Nom/libellé du genre (ex: Action, Comédie, max 50 caractères)
  films?: Film[];      // Liste des films associés à ce genre (OneToMany)
}