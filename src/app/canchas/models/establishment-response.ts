export interface EstablishmentResponse {
    id: number;
    name: string;
    brandId: number;
    addressId: number;
    canShower: boolean;
    openingHour: Date;
    closingHour: Date;
    active: boolean;
    averageRating: number;
    types?: string[];
}

