export interface ReviewRequest {
    rating: number;
    message?: string;
    establishmentId: number;
    clientId: string;
   // clientName: string;   // agregar después !!
   // createdAt: Date;      // agregar después !!
}
