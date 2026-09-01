// src/app/models/paiement.ts
export interface PaiementRequestDto {
  reservationId: number;
  amount: number;
  status: string;
}

export interface PaiementResponseDto {
  id: number;
  reservationId: number;
  amount: number;
  status: string;
}