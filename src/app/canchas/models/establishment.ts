
export interface Establishment {
    id: number;
    name: string;
    brandId: number;
    address: string;
    canShower: boolean;
    openingHour: Date;
    closingHour: Date;
    active: boolean;
}
