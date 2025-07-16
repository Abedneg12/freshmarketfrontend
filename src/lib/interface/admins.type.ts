export interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  StoreAdminAssignment: StoreAdminAssignment[];
  isVerified: boolean;
  addresses: string[];
}
export interface Store {
  id: string;
  name: string;
}

export interface StoreAdminAssignment{
  storeId: string;
  store : Store;
}