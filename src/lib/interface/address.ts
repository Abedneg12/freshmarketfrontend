export interface IAddress {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  isMain: boolean;
  latitude: number;
  longitude: number;
}
