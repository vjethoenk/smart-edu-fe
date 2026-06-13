import Navbar from "./components/Navbar";
import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <LiveChatWidget />
    </div>
  );
}
