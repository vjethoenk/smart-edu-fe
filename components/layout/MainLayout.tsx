import Link from "next/link";
import { Button } from "../ui/button";
import Navbar from "../user/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
