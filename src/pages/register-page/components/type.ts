type role = "customer" | "organiser" | "";

export default interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  status_role: role;
  referral_code?: string;
}