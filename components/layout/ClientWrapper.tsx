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
  }, []);

  const handleFinishLoading = () => setIsLoading(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

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
