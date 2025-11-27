export interface EstablishmentRequest {
    name: string;
    address: string;
    canShower: boolean;
    openingHour: Date | string;
    closingHour: Date | string;
    brandId: number;
}
