import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          {/* Icon thành công */}
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            Cảm ơn bạn đã đăng ký khóa học
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Mã giao dịch: <span className="font-medium">#HD123456</span>
          </p>
          <p className="text-sm text-gray-600">
            Thời gian: {new Date().toLocaleString("vi-VN")}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full bg-green-500 hover:bg-green-600">
            Vào học ngay
          </Button>
          <Button variant="outline" className="w-full">
            Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
