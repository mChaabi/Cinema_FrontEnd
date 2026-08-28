export interface Paiement {
  id?: number;
  reservationId: number;
  amount: number;
  status: string;
  paymentDate?: string;
}