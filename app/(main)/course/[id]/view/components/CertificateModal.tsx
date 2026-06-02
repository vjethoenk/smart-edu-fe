"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ICertificate } from "@/features/certificate/types";
import { toast } from "sonner";
import {
  Printer,
  Share2,
  Copy,
  Mail,
  Loader2,
  Award,
  Calendar,
  User,
  BookOpen,
  Sparkles,
} from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: ICertificate;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificate,
}: CertificateModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const baseApiUrl = apiUrl.endsWith("/v1") ? apiUrl : `${apiUrl}/v1`;
  const certificateImgUrl = `${baseApiUrl}/certificates/${certificate.certificateCode}/view`;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-certificate?code=${certificate.certificateCode}`
      : `https://smartedu.com/verify-certificate?code=${certificate.certificateCode}`;

  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open(certificateImgUrl, "_blank");
    if (printWindow) {
      setTimeout(() => {
        printWindow.print();
        setIsPrinting(false);
      }, 1000);
    } else {
      toast.error(
        "Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt chặn popup.",
      );
      setIsPrinting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã sao chép liên kết chứng chỉ");
    } catch {
      toast.error("Không thể sao chép liên kết");
    }
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const handleShareEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`Chứng chỉ hoàn thành khóa học SmartEdu - ${certificate.courseId.title}`)}&body=${encodeURIComponent(
        `Xin chào,\n\nTôi vừa hoàn thành khóa học "${certificate.courseId.title}" trên nền tảng SmartEdu và nhận được chứng chỉ danh giá này.\n\nXem thông tin chứng nhận của tôi tại đây: ${shareUrl}\n\nTrân trọng!`,
      )}`,
      "_blank",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto p-4 rounded-xl bg-gradient-to-b from-indigo-50/50 via-white to-white border border-indigo-100">
        <DialogHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Award className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            🎉 Chúc mừng hoàn thành khóa học!
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Chứng chỉ của bạn đã sẵn sàng
          </DialogDescription>
        </DialogHeader>

        {/* Certificate Image */}
        <div className="my-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-[1.414/1] flex items-center justify-center">
          <img
            src={certificateImgUrl}
            alt="SmartEdu Certificate"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Metadata - compact grid */}

        {/* Action Buttons - compact */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            size="sm"
            className="flex-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 mr-1" />
                In / Tải PDF
              </>
            )}
          </Button>

          <div className="flex gap-1.5 justify-center">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              size="sm"
              className="w-9 h-9 p-0 rounded-full"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleShareFacebook}
              size="sm"
              className="w-9 h-9 p-0 rounded-full"
            >
              <FacebookIcon className="w-4 h-4 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              onClick={handleShareLinkedIn}
              size="sm"
              className="w-9 h-9 p-0 rounded-full"
            >
              <LinkedinIcon className="w-4 h-4 text-sky-700" />
            </Button>
            <Button
              variant="outline"
              onClick={handleShareEmail}
              size="sm"
              className="w-9 h-9 p-0 rounded-full"
            >
              <Mail className="w-4 h-4 text-rose-500" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
