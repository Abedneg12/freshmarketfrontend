export interface IUser {
  loading: boolean;
  id: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  referralCode?: string;
  isVerified: boolean;
  role: "USER" | "SUPER_ADMIN" | "STORE_ADMIN";
  error: string | null;
}
export interface ILogin {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  message: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
}

export interface IErrorResponse {
  error: string;
}

export interface IGetProfileResponse {
  message: string;
  data: IUser;
}

export interface IMessageResponse {
  message: string;
}

export interface IMessageError {
  message: string;
}
