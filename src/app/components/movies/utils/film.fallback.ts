import { Film } from '../../../models/film';
import { TypeMedia } from '../../../models/media';
import { TypePersonne } from '../../../models/personne';

export function getFallbackFilms(): Film[] {
  return [
    {
      id: 1,
      titre: 'Inception',
      description: "Un voleur qui s'infiltre dans les rêves pour y voler des secrets.",
      duree: 148,
      annee: 2010,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      note: 4.8,
      genre: { id: 1, libelle: 'Science-Fiction' },
      nationalite: { id: 1, libelle: 'États-Unis' },
      realisateur: { prenom: 'Christopher', nom: 'Nolan', typePersonne: TypePersonne.REALISATEUR },
      acteurs: [
        { prenom: 'Leonardo', nom: 'DiCaprio', typePersonne: TypePersonne.ACTEUR },
        { prenom: 'Joseph', nom: 'Gordon-Levitt', typePersonne: TypePersonne.ACTEUR }
      ],
      medias: [
        {
          media: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
          typeMedia: TypeMedia.IMAGE
        }
      ]
    },
    {
      id: 2,
      titre: 'Interstellar',
      description: "Un voyage à travers un trou de ver pour sauver l'humanité.",
      duree: 169,
      annee: 2014,
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
      note: 4.9,
      genre: { id: 1, libelle: 'Science-Fiction' },
      nationalite: { id: 1, libelle: 'États-Unis' },
      realisateur: { prenom: 'Christopher', nom: 'Nolan', typePersonne: TypePersonne.REALISATEUR },
      acteurs: [
        { prenom: 'Matthew', nom: 'McConaughey', typePersonne: TypePersonne.ACTEUR },
        { prenom: 'Anne', nom: 'Hathaway', typePersonne: TypePersonne.ACTEUR }
      ],
      medias: [
        {
          media: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
          typeMedia: TypeMedia.IMAGE
        }
      ]
    },
    {
      id: 3,
      titre: 'The Dark Knight',
      description: 'Batman affronte le Joker dans les rues de Gotham City.',
      duree: 152,
      annee: 2008,
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      note: 5,
      genre: { id: 2, libelle: 'Action' },
      nationalite: { id: 1, libelle: 'États-Unis' },
      realisateur: { prenom: 'Christopher', nom: 'Nolan', typePersonne: TypePersonne.REALISATEUR },
      acteurs: [
        { prenom: 'Christian', nom: 'Bale', typePersonne: TypePersonne.ACTEUR },
        { prenom: 'Heath', nom: 'Ledger', typePersonne: TypePersonne.ACTEUR }
      ],
      medias: [
        {
          media: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
          typeMedia: TypeMedia.IMAGE
        }
      ]
    }
  ];
}
