# Báo cáo Cá nhân: Frontend & Integration

## 1. Thông tin chung
- **Thành viên:** Ngô Hải Văn 2A202600386
- **Vai trò:** Frontend / Integration
- **Mục tiêu đảm nhiệm:** Build app/demo flow, nối UI với data mock/LLM, đảm bảo prototype chạy được mượt mà, sẵn sàng cho việc live demo. Xây dựng Data Flywheel nối từ UI tới System Prompt.

---

## 2. Chi tiết các công việc đã thực hiện

### 2.1. Phát triển Frontend & UI/UX (Module `components/chat/`)
Tôi đã phát triển bộ UI hoàn chỉnh và linh hoạt cho AI Chat dựa trên Next.js:
- **Cấu trúc Chat Core:** Xây dựng giao diện chat chính (`ChatScreen.tsx`), quản lý danh sách tin nhắn (`MessageList.tsx`), cấu trúc hiển thị (`MessageBubble.tsx`), và khu vực nhập liệu (`ChatInput.tsx`, `ChatHeader.tsx`, `ChatFooter.tsx`).
- **Interactive Medical UI (Giao diện chọn lịch):** Thay vì bắt người dùng gõ tay thủ công, tôi đã code các interactive component cho phép click chọn trực tiếp:
  - `DoctorCard.tsx` và `DoctorCardList.tsx` để render danh sách bác sĩ.
  - `SlotChip.tsx` và `SlotChipList.tsx` để render và tick chọn khung giờ khám bệnh trực quan.
- **Micro-interactions:** Phát triển `ToolCallBadge.tsx` (trạng thái loading khi AI thực thi tool) và `SuggestedQuestions.tsx` (gợi ý sẵn các thao tác để hướng user vào luồng chuẩn).
- **Feedback UI:** Phát triển `FeedbackDialog.tsx` và `FeedbackButtons.tsx` để user đánh giá hệ thống (là đầu vào quan trọng cho Data Flywheel).

### 2.2. Integration: Tích hợp API, Hệ thống Tools & Data Mock
- **Luồng AI API (`app/api/chat/route.ts`):** Thiết lập endpoint bằng Vercel AI SDK xử lý luồng stream hai chiều giữa UI và LLM (OpenAI/Gemini).
- **Data Mock (`lib/data/`):** Tích hợp dữ liệu giả lập bệnh viện (JSON) đóng vai trò backend data: `departments.json`, `doctors.json`, `faq.json`, `branches.json`, và logic mapping chuyên khoa từ triệu chứng `symptom-department-map.ts`.
- **Function Calling Framework (`lib/agent/tools/`):** Tích hợp 13 tools để AI biến ý định của người dùng thành thao tác thật:
  - **Nhóm Booking & Scheduling (Quản lý lịch khám):** `book-appointment.ts` (Đặt lịch hẹn), `cancel-appointment.ts` (Hủy lịch), `check-availability.ts` (Kiểm tra giờ trống), `reschedule-appointment.ts` (Đổi lịch hẹn), `schedule-followup.ts` (Đặt lịch tái khám).
  - **Nhóm User & History (Dữ liệu người dùng):** `get-current-user.ts` (Lấy thông tin bệnh nhân), `get-user-appointments.ts` (Lấy lịch sử khám bệnh).
  - **Nhóm Clinical & FAQ (Tư vấn Y tế & Bệnh viện):** `recommend-department.ts` (Gợi ý chuyên khoa), `list-doctors.ts` (Liệt kê bác sĩ), `get-preparation-guide.ts` (Hướng dẫn chuẩn bị trước khám), `search-hospital-faq.ts` (Giải đáp FAQ bệnh viện), `find-nearest-branch.ts` (Tìm cơ sở gần nhất).
  - **Nhóm Feedback (Flywheel):** `save-feedback-note.ts` (Lưu log phản hồi từ người dùng).

### 2.3. Vòng lặp Data Flywheel (Được chứng minh qua `lib/agent/`)
Dự án không dừng ở mock UI mà đã hoàn thiện vòng lặp Data Flywheel logic được viết trong code:
1. **Thu thập dữ liệu (Collect):** Khi người dùng báo lỗi qua `FeedbackDialog.tsx`, tool `save-feedback-note.ts` bắt lại log.
2. **Đánh giá tự động (Eval):** Logic trong `judge.ts` sẽ đánh giá kết quả từ hành vi của LLM trong session.
3. **Thăng cấp kiến thức (Promotion):** Job xử lý `promotion-worker.ts` tự động filter những case học được (golden cases).
4. **Cập nhật nhận thức (Injection):** Tích hợp vào `golden-loader.ts` để đọc các rule tốt nhúng động lại vào `system-prompt.ts`. Nhờ vòng lặp này, Agent có khả năng tự vá lỗi và cải thiện câu trả lời ở những phiên sau dựa trên feedback người dùng.

### 2.4. Build App & Deployment Setup
- Cấu hình chạy Next.js Server và kết hợp chạy lệnh Cloudflared Tunnel để sinh public URL, bảo vệ project khởi sự cố network khi thuyết trình Demo trực tiếp.

---

## 3. Framework & Công nghệ đã sử dụng (Theo Repo)
- **Frontend Core:** Next.js (App Router), React, Tailwind CSS (`tailwind.config.ts`, `globals.css`).
- **AI Integration:** Vercel UI/AI SDK (`@ai-sdk`).
- **Flywheel/Data Processing:** TypeScript strict mode, JSON stores, API Routes.

---

## 4. Kết luận
Vai trò Frontend / Integration trong project này không chỉ là phát triển UI đơn thuần, mà tôi đã tiếp quản trọn vẹn luồng giao tiếp hai chiều: từ Input của người dùng ở UI, gọi Tool thực tế thay đổi Data Mock, cho đến việc đẩy phản hồi vào Pipeline **Data Flywheel** tự sửa chữa hệ thống (`judge` -> `promotion` -> `golden loader`). Sản phẩm chính là một Prototype ứng dụng AI y tế hoàn chỉnh, có ý nghĩa và chạy thực tế.
