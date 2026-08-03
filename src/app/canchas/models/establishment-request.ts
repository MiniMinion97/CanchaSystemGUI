export interface EstablishmentRequest {
    name: string;
    addressId: number;
    canShower: boolean;
    openingHour: Date | string;
    closingHour: Date | string;
    brandId: number;
}
