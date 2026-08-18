import { Seance } from './seance';

export interface Salle {
  id?: number;          // Hérité de AbstractModel (identifiant unique)
  numero: number;       // Numéro de la salle
  capacite: number;     // Capacité (nombre de places) de la salle
  seances?: Seance[];   // Liste des séances programmées dans cette salle (OneToMany)
  addedDate?: Date;     // Date d'ajout en base de données
}