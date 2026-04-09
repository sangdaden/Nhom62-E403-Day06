import type { UIMessage } from "ai";
import { ChatScreen } from "@/components/chat/ChatScreen";

const MOCK_MESSAGES: UIMessage[] = [
  {
    id: "1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Xin chào! Mình là trợ lý ảo VinmecCare. Bạn có thể hỏi mình về lịch khám, triệu chứng sức khỏe, hoặc thông tin bệnh viện.",
      },
    ],
  },
  {
    id: "2",
    role: "user",
    parts: [{ type: "text", text: "Tôi bị đau bụng buồn nôn 3 ngày" }],
  },
  {
    id: "3",
    role: "assistant",
    parts: [
      { type: "text", text: "Để giúp anh/chị tốt hơn, mình sẽ tra cứu khoa phù hợp." },
      {
        type: "dynamic-tool",
        toolName: "recommend_department",
        toolCallId: "demo-tc-1",
        state: "output-available",
        input: { symptoms: "đau bụng buồn nôn" },
        output: { top: [{ id: "tieu-hoa", name: "Khoa Tiêu hóa" }] },
      },
      {
        type: "text",
        text: "Dựa trên triệu chứng đau bụng buồn nôn kéo dài 3 ngày, mình gợi ý anh/chị khám tại **Khoa Tiêu hóa**. Anh/chị có muốn mình kiểm tra lịch trống không?",
      },
    ],
  },
  {
    id: "4",
    role: "user",
    parts: [{ type: "text", text: "Có, hãy kiểm tra lịch trống cho tôi" }],
  },
  {
    id: "5",
    role: "assistant",
    parts: [
      {
        type: "dynamic-tool",
        toolName: "check_availability",
        toolCallId: "demo-tc-2",
        state: "output-available",
        input: { departmentId: "tieu-hoa" },
        output: { slots: ["09:00", "10:30", "14:00"] },
      },
      {
        type: "text",
        text: "Mình tìm thấy lịch trống ngày mai tại Khoa Tiêu hóa:\n• 09:00 sáng\n• 10:30 sáng\n• 14:00 chiều\n\nBạn muốn đặt lịch vào khung giờ nào? Bạn có muốn mình đặt lịch ngay không?",
      },
    ],
  },
];

export default function ChatPreviewPage() {
  return <ChatScreen initialMessages={MOCK_MESSAGES} />;
}
