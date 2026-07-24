export interface StatsResponse {
    totalReservations: number;
    completedReservations: number;
    canceledReservations: number;
    pendingReservations: number;
    totalOwners: number;
    totalClients: number;
}