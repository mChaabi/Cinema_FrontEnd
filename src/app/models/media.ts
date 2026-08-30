import { Film } from './film';

// Définition de l'Enum pour correspondre exactement à votre type Java
export enum TypeMedia {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT'
}

export interface Media {
  id?: number;              // Hérité de AbstractModel
  media: string;            // Le nom ou le chemin du fichier (max 100 chars)
  typeMedia?: TypeMedia;    // Utilisation de l'enum défini ci-dessus
  addedDate?: Date;         // Date d'ajout
  film?: Film;              // Le film auquel ce média est rattaché
  url?: string;             // Alias DTO éventuel
  chemin?: string;          // Alias DTO éventuel
  thumbnailUrl?: string; 
}