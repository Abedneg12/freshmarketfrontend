export interface IUser {
  id: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  referralCode?: string;
  isVerified: boolean;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
