export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
export interface IAuth {
  access_token: string;
  user: IUser;
}
export interface IAccount {
  user: IUser;
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
