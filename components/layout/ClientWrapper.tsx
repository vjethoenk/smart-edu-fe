"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SmartEduSplashScreen from "@/components/layout/SmartEduSplashScreen";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";
import { usePathname } from "next/navigation";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Chỉ hiển thị splash screen tải lần đầu trên trang chủ
    if (pathname === "/") {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200); // Đợi splash screen chạy mượt mà
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []); // Chỉ chạy một lần duy nhất khi ứng dụng tải lần đầu (mount)

  const handleFinishLoading = () => setIsLoading(false);

  const isHomePage = pathname === "/";

  if (!isClient) return <div className="opacity-0">Loading...</div>;

  return (
    <>
      <Providers>{children}</Providers>
      <Toaster position="top-center" richColors expand />

      <AnimatePresence mode="wait">
        {isLoading &&
          (isHomePage ? (
            <SmartEduSplashScreen
              key="splash"
              finishLoading={handleFinishLoading}
            />
          ) : (
            <LoadingScreen key="loading" />
          ))}
      </AnimatePresence>
    </>
  );
}
