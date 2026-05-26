import { ChatPanel } from "@/components/chat/ChatPanel";

export default function InstructorChatPage() {
  return (
    <div className="min-h-full bg-[#f7f8fc]">
      <ChatPanel
        title="Chat Giảng viên"
        subtitle="Liên hệ trực tiếp với học viên trong các khóa học bạn đang giảng dạy."
        showCourseFilter
      />
    </div>
  );
}
