interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  StoreAdminAssignment: Store[];
  isVerified: boolean;
  addresses: string[];
}
interface Store {
  id: string;
  name: string;
}