export interface ReviewRequest {
    rating: number;
    message?: string;
    establishmentId: number;
    clientName?: string;
    createdAt?: Date;
    clientId: string;
   // clientName: string;   // agregar después !!
   // createdAt: Date;      // agregar después !!
}
