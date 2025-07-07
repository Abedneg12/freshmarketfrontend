export interface Store {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl?: string | null;
    createdAt: string;
}