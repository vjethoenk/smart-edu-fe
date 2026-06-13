export interface ICertificate {
  _id: string;
  certificateCode: string;
  issuedAt: string;
  createdAt?: string;
  updatedAt?: string;
  userId: {
    _id?: string;
    name: string;
    email: string;
  };
  courseId: {
    _id?: string;
    title: string;
  };
}

export interface IVerifyCertificate {
  isValid: boolean;
  certificateCode: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
}
