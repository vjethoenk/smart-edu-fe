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
  title?: string;
  content?: string;
  sectionId?: string;
  videoUrl?: string;
  type?: string;
  createdAt?: string;
  quizId?: string;
  courseId?: string;
  pdfUrl?: string;
  completionConditions?: {
    duration?: number;
    // type?: string;
  };
}

export interface IQuestion {
  _id?: string;
  content: string;
  options: string[];
  score: number;
  correctAnswer: string;
  status?: string;
  createdAt?: string;
  createBy?: {
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

export interface ICourseMonitoringStudent {
  userId: string;
  name: string;
  email?: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}

export interface ICourseMonitoring {
  courseId: string;
  enrolledCount: number;
  completedStudents: number;
  completionRate: number;
  averageProgress: number;
  totalLessons: number;
  topStudents?: ICourseMonitoringStudent[];
}

export interface ICreateQuizQuestion {
  quizId: string;
  questionId: string;
  content: string;
  options: string[];
  correctAnswer: string;
  score: number;
}

export interface IAttempt {
  _id?: string;
  userId?: string;
  quizId: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  status: "in_progress" | "submitted";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizAttemptResponse {
  attemptId: string;
  quizId: string;
  title: string;
  description?: string;
  limitTime: number;
  passScore: number;
  totalScore: number;
  questionsCount: number;
  questions: IQuizQuestionResponse[];
}

export interface IQuizQuestionResponse {
  _id: string;
  questionId: string;
  content: string;
  options: IQuizOptionResponse[];
  score: number;
}
export interface IQuizOptionResponse {
  _id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface ICreateAttemptAnswer {
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
}

export interface IAttemptAnswerResponse {
  _id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  score: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubmitQuizResponse {
  attemptId: string;
  quizId: string;
  title: string;
  submitTime: string;
  totalScore: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  passScore: number;
  isPassed: boolean;
  status: "submitted";
  message: string;
  details: ISubmitQuizDetail[];
}
export interface ISubmitQuizDetail {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
}

export interface IQuizResultData {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  passScore: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  isPassed: boolean;
  status: string;
}

export interface ITracking {
  lessonId: string;
  itemType: string;
  event: string;
  currentTime: number;
}

export interface ICartItem {
  _id: string;
  courseId: ICourse; // Populated course info
  userId: string;
  price: number;
  promotionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartTotalResponse {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
}

export interface IAddToCartRequest {
  courseId: string;
  price: number;
  promotionId?: string;
}

// Types cho Promotions
export interface IPromotion {
  _id: string;
  code: string;
  discountPercentage: number;
  courseId: string | ICourse;
  description: string;
  startDate: string;
  endDate: string;
  maxUsageCount: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPromotionInput {
  code: string;
  discountPercentage: number;
  courseId: string;
  description: string;
  startDate: string;
  endDate: string;
  maxUsageCount: number;
  isActive?: boolean;
}

export interface IPurchase {
  courseId: string;
  purchaseCount: number;
  courseTitle: string;
}

export interface WordQuestion {
  _id?: string;
  content: string;
  options: string[];
  correctAnswer: string;
  score: number;
}
