"use client";
import { useEffect, useState } from "react";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { AnimatePresence } from "framer-motion";
import SmartEduSplashScreen from "@/components/layout/SmartEduSplashScreen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  return (
    <html lang="vi">
      <body>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <SmartEduSplashScreen
              key="splash"
              finishLoading={handleFinishLoading}
            />
          ) : (
            <div key="content" className="relative z-0">
              <Providers>{children}</Providers>
              <Toaster position="top-center" richColors expand={true} />
            </div>
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}
