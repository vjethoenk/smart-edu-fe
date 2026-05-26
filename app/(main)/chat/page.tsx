import { ChatPanel } from "@/components/chat/ChatPanel";

export default function MainChatPage() {
  return (
    <div className="min-h-full bg-[#f7f8fc]">
      <ChatPanel
        title="Tin nhắn"
        subtitle="Gửi và nhận tin nhắn với giảng viên trong khóa học của bạn."
      />
    </div>
  );
}
