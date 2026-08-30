import { Film } from "./film";
import { Salle } from "./salle";
import { Seance } from "./seance";

// models/dashboard.ts
export interface DashboardData {
  films: Film[];
  salles: Salle[];
  seances: Seance[];
  totalReservations: number;
  totalBilletsVendus: number;
  occupationParSalle: Record<number, number>;
}