export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface QuestionResponse {
  data: IQuestion[];
  total: number;
  skip: number;
  limit: number;
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
  role?: {
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
  status?: string;
  createBy: {
    _id: string;
    email: string;
    name: string;
  };
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
  sectionId?: string;
  videoUrl?: string;
  type?: string;
  createdAt?: string;
  quizId?: string;
  courseId?: string;
  pdfUrl?: string;
}

export interface IQuestion {
  _id?: string;
  content: string;
  options: string[];
  score: number;
  correctAnswer: string;
  status?: string;
  createdAt?: string;
  createBy: {
    _id: string;
    email: string;
  };
}

export interface IQuiz {
  _id?: string;
  title: string;
  description: string;
  courseId: string;
  questions: object[];
  limitTime: number;
  passScore: number;
  totalScore: number;
  shuffleQuestions?: boolean;
  showResult?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPayment {
  paymentId: string;
  orderCode: number;
  amount: number;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface IEnrollment {
  _id?: string;
  courseId: string;
  userId: string;
  status?: string;
}

export interface ICreateQuizQuestion {
  quizId: string;
  questionId: string;
  content: string;
  options: string[];
  correctAnswer: string;
  score: number;
}
