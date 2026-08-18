export interface Customer {
  id?: number;          // Hérité de AbstractModel (identifiant unique)
  firstname: string;    // Prénom du client (obligatoire, max 40 caractères)
  lastname: string;     // Nom de famille du client (obligatoire, max 40 caractères)
  email: string;        // Adresse e-mail unique (obligatoire)
  addedDate?: Date;     // Date d'ajout en base de données
}