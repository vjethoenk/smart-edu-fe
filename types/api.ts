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

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  categoryId: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sections?: ISection[];
}

export interface ISection {
  _id?: string;
  title: string;
  courseId: string;
  createdAt?: string;
  lessons?: ILesson[];
}

export interface ILesson {
  _id?: string;
  title: string;
  content: string;
  sectionId: string;
  videoUrl?: string;
  type: string;
  createdAt?: string;
}
