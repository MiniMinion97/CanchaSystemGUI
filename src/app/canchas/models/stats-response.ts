export interface CanchaTypeCount {
    canchaType: string;
    count: number;
}

export interface TopEstablishment {
    establishmentId: number;
    establishmentName: string;
    reservationCount: number;
}

export interface StatsResponse {
    totalReservations: number;
    completedReservations: number;
    canceledReservations: number;
    pendingReservations: number;
    totalOwners: number;
    totalClients: number;
    totalActiveCanchas: number;
    totalActiveEstablishments: number;
    totalActiveBrands: number;
    averageReservationsPerDay: number;
    cancellationRate: number;
    canchasByType: CanchaTypeCount[];
    topEstablishments: TopEstablishment[];
}