export type Category = {
  id: number;
  name: string;
  products?: {
    id: number;
    name: string;
  }[];
};