# Reflection — những việc đã làm

_Cập nhật ngày 2026-04-09_

## 1) Tổng quan
Dựa trên các file hiện có trong repo và lịch sử commit đã kiểm tra, mình đã hoàn thành được cả **phần định hướng sản phẩm**, **phần tài liệu nhóm**, và **một phần prototype/demo app** cho bài VinMec.

---

## 2) Những việc đã làm được

### A. Chốt hướng bài toán và narrative sản phẩm
**Bằng chứng:** `01-task/01-Sangdaden-task.md`

Mình đã:
- chốt bài toán **AI health assistant hỗ trợ tái khám** cho VinMec,
- viết rõ **problem statement**,
- xác định hướng **augmentation-first**,
- mô tả **AI Product Canvas** theo 3 phần: `Value / Trust / Feasibility`,
- xác định 3 feature chính:
  1. smart reminder,
  2. AI gợi ý slot và hỗ trợ đặt lịch,
  3. nhắc lịch đa kênh + feedback loop.

### B. Phân công team và lên cách phối hợp demo
**Bằng chứng:** `phan-cong-team-5-nguoi.md`

Mình đã:
- chia vai trò rõ cho team 5 người,
- gán đầu việc theo từng vai (`Planner`, `UX`, `AI`, `Frontend`, `Eval/QA`),
- viết checklist cho từng người,
- chia timeline làm việc trong ngày,
- gợi ý ai nói phần nào trong demo 2 phút.

### C. Bổ sung tài liệu mô tả project
**Bằng chứng:** commit `105a646` — `Add detailed documentation for hackathon project including README, team roles, and project overview`

Mình đã cập nhật thêm phần:
- `README.md`,
- mô tả vai trò team,
- tổng quan dự án để người khác dễ theo dõi và onboard.

### D. Nâng cấp prototype/app demo
**Bằng chứng:**
- commit `2a3baa3` — `feat: update system prompt, interactive UI for doctor/slot selection, and chat screen improvements`
- commit `1402741` — `feat: update DoctorCard and SlotChip interactive UI components`

Mình đã:
- chỉnh **system prompt** cho agent,
- cải thiện **chat flow**,
- nâng cấp UI tương tác cho `DoctorCard` và `SlotChip`,
- làm phần demo chọn bác sĩ/chọn slot trực quan hơn.

### E. Xử lý và khôi phục sự cố Git
**Bằng chứng:**
- branch hiện tại sạch: `main...origin/main`
- branch khôi phục: `recover-dev`
- commit recover được: `1d92dbe` — `feat: Vinmec AI Agent Demo - Lab06 Nhom62`

Mình đã:
- kiểm tra nguyên nhân lệch branch,
- xác định commit cũ của dev khác vẫn còn,
- khôi phục nó sang branch riêng `recover-dev`,
- đưa repo về trạng thái an toàn hơn để không mất code cũ.

---

## 3) Điểm mình làm tốt
- Chốt được **scope tương đối rõ** cho bài hackathon.
- Tài liệu viết khá đầy đủ, có thể dùng luôn để trình bày.
- Flow demo đã đi đúng hướng: **nhắc lịch → hiểu nhu cầu → gợi ý slot → xác nhận**.
- Khi gặp sự cố Git, đã xử lý theo hướng **khôi phục trước, merge sau**, giảm rủi ro mất code.

---

## 4) Điều cần cải thiện
- Cần quản lý branch cẩn thận hơn, tránh thao tác trực tiếp lên `main` khi có nhiều người cùng làm.
- Nên thống nhất sớm hơn giữa **phần docs** và **phần app** để tránh lệch nội dung.
- Cần thêm bước review nội bộ trước khi push các thay đổi lớn.

---

## 5) Bài học rút ra
1. **Không force-push vào `main` khi chưa backup branch.**
2. **Mỗi người nên làm trên branch riêng** rồi mới merge.
3. **Tài liệu và prototype phải bám cùng một câu chuyện sản phẩm.**
4. Khi debug Git, nên ưu tiên:
   - kiểm tra `git status`,
   - xem `git log --oneline --graph --all`,
   - tạo branch backup trước khi reset/push.

---

## 6) Việc nên làm tiếp theo
- hoàn thiện `spec-final.md`,
- chốt `prototype-readme.md`,
- làm poster/slides,
- chạy dry-run demo 2 phút,
- thống nhất branch nào là branch nộp cuối cùng của nhóm.

---

## 7) Data Flywheel cho dự án hiện tại
Dự án Vinmec AI Agent đã có sẵn các điểm thu dữ liệu từ khách hàng như:
- chat message của user,
- feedback `thumbs up/down`,
- lý do góp ý,
- tools được gọi,
- kết quả đặt hoặc đổi lịch.

Flywheel ngắn gọn của dự án là:

**User chat và đặt lịch → hệ thống thu feedback và outcome → team phân tích insight → cải thiện prompt/UI/logic → trải nghiệm tốt hơn → có thêm user và thêm dữ liệu tốt hơn.**

File chi tiết: `01-task/reflection/data-flywheel.md`
