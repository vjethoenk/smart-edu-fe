export interface ICertificate {
  _id: string;
  certificateCode: string;
  issuedAt: string;
  userId: {
    name: string;
    email: string;
  };
  courseId: {
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
