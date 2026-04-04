import "./globals.css";
import ClientWrapper from "@/components/layout/ClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Edu",
  description: "Hệ thống quản lý giáo dục thông minh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
