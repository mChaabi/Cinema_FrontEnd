import { Film } from './film';
import { Salle } from './salle';

export interface Seance {
  id?: number;            // Hérité de AbstractModel (identifiant unique)
  dateProjection?: Date;  // Date de la projection (TemporalType.DATE)
  heureDebut?: Date;      // Heure de début de la séance (TemporalType.TIME)
  heureFin?: Date;        // Heure de fin de la séance (TemporalType.TIME)
  film?: Film;            // Film projeté lors de cette séance (ManyToOne)
  salle?: Salle;          // Salle où a lieu la projection (ManyToOne)
}