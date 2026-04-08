# Eval / QA / Demo Ops

Trần Đình Minh Vương - Mã HV: 2A202600495
---

## 1) Vai trò chính

**Phụ trách:**
- Viết phần `eval metrics + threshold`
- Viết `top 3 failure modes`
- Viết `ROI 3 scenarios`
- Test demo nhiều lần, bắt bug nhỏ
- Chuẩn bị backup video, script, và file nộp

**Output rõ ràng:**
- Bảng metrics với threshold cụ thể
- Danh sách failure modes + cách xử lý
- ROI scenarios (conservative / realistic / optimistic)
- Video/screenshot backup nếu app lỗi

---

## 2) Eval Metrics + Threshold

### Metrics chính cần đo

| Metric | Định nghĩa | Threshold mục tiêu | Red flag |
|--------|-----------|-------------------|----------|
| **Reminder response rate** | % user phản hồi sau khi nhận nhắc lịch | ≥ 40% | < 20% |
| **Slot acceptance rate** | % user chấp nhận slot AI đề xuất | ≥ 70% | < 50% |
| **Rebooking completion rate** | % user hoàn tất flow đặt lại lịch | ≥ 60% | < 40% |

### Metrics phụ (nếu có thời gian)

| Metric | Định nghĩa | Mục tiêu |
|--------|-----------|----------|
| **AI response time** | Thời gian từ input đến output | < 3 giây |
| **Intent accuracy** | % AI hiểu đúng ý định user | ≥ 85% |
| **Multi-turn success rate** | % hội thoại đa lượt thành công | ≥ 75% |

### Cách đo trong demo
- **Mock data:** giả lập 10 case test với kết quả mong đợi
- **Live test:** chạy thật 3-5 case trong demo
- **User feedback:** hỏi người xem demo có thấy hợp lý không

---

## 3) Top 3 Failure Modes

### Failure Mode 1: AI hiểu sai yêu cầu thời gian

**Mô tả:**
- User nói: "Đặt giúp mẹ tôi chiều thứ 6 tuần sau"
- AI hiểu nhầm thành tuần này hoặc sai ngày

**Tác động:**
- Đặt nhầm lịch → user mất niềm tin
- Severity: **HIGH**

**Mitigation:**
- AI phải confirm lại: "Em hiểu là chiều thứ 6 ngày 15/4, đúng không ạ?"
- Hiển thị rõ ngày/giờ trước khi xác nhận
- Nếu AI không chắc → hỏi lại thay vì đoán

**Detection:**
- Test với 10 câu input khác nhau về thời gian
- Log các case AI hiểu sai
- Đo intent accuracy

---

### Failure Mode 2: AI nhắc sai người / sai lịch sử

**Mô tả:**
- Nhắc lịch cho sai bệnh nhân
- Nhắc lịch đã hủy hoặc đã đặt rồi
- Nội dung nhắc không phù hợp với ngữ cảnh

**Tác động:**
- User bối rối, mất niềm tin
- Severity: **HIGH**

**Mitigation:**
- Kiểm tra kỹ patient ID và appointment history
- Có bước verify trước khi gửi nhắc
- Log tất cả reminder được gửi để audit

**Detection:**
- Review reminder log
- Test với nhiều patient profile khác nhau
- Có QA checklist trước khi demo

---

### Failure Mode 3: Người cao tuổi không phản hồi được trên app

**Mô tả:**
- UI quá phức tạp
- Font chữ nhỏ, khó đọc
- Không biết cách trả lời AI
- Không có fallback option

**Tác động:**
- User bỏ qua hoặc không hoàn tất flow
- Severity: **MEDIUM**

**Mitigation:**
- Có **caregiver mode**: gửi nhắc cho người thân
- Có **multi-channel**: SMS, Zalo, call nếu không phản hồi trên app
- Có **hotline fallback**: nút "Gọi tổng đài hỗ trợ"
- UI đơn giản, font lớn, button rõ ràng

**Detection:**
- Test với người lớn tuổi thật (nếu có)
- Đo response rate theo độ tuổi
- Có backup plan trong demo

---

## 4) ROI — 3 Scenarios

### Giả định chung
- VinMec có ~500,000 lượt tái khám/năm
- Tỷ lệ missed appointment hiện tại: 15%
- Chi phí mỗi missed appointment: 500,000 VNĐ (mất slot, tái lập lịch, hotline)
- Chi phí vận hành AI: 200 triệu VNĐ/năm (infra + maintenance)

---

### Scenario 1: Conservative (Thận trọng)

**Giả định:**
- AI giảm missed appointment từ 15% → 12% (giảm 3%)
- Chỉ áp dụng cho 30% bệnh nhân (người cao tuổi)

**Tính toán:**
- Số lượt tái khám áp dụng: 500,000 × 30% = 150,000
- Số appointment được cứu: 150,000 × 3% = 4,500
- Tiết kiệm: 4,500 × 500,000 = **2.25 tỷ VNĐ/năm**
- Chi phí: 200 triệu VNĐ/năm
- **ROI: 2.05 tỷ VNĐ/năm (10x)**

---

### Scenario 2: Realistic (Thực tế)

**Giả định:**
- AI giảm missed appointment từ 15% → 10% (giảm 5%)
- Áp dụng cho 50% bệnh nhân

**Tính toán:**
- Số lượt tái khám áp dụng: 500,000 × 50% = 250,000
- Số appointment được cứu: 250,000 × 5% = 12,500
- Tiết kiệm: 12,500 × 500,000 = **6.25 tỷ VNĐ/năm**
- Chi phí: 200 triệu VNĐ/năm
- **ROI: 6.05 tỷ VNĐ/năm (30x)**

**Bonus:**
- Giảm tải hotline: ~20% cuộc gọi về đặt lịch
- Tăng patient satisfaction score

---

### Scenario 3: Optimistic (Lạc quan)

**Giả định:**
- AI giảm missed appointment từ 15% → 8% (giảm 7%)
- Áp dụng cho 70% bệnh nhân
- Có feedback loop → cải thiện liên tục

**Tính toán:**
- Số lượt tái khám áp dụng: 500,000 × 70% = 350,000
- Số appointment được cứu: 350,000 × 7% = 24,500
- Tiết kiệm: 24,500 × 500,000 = **12.25 tỷ VNĐ/năm**
- Chi phí: 200 triệu VNĐ/năm
- **ROI: 12.05 tỷ VNĐ/năm (60x)**

**Bonus:**
- Tăng revenue từ slot được fill
- Tăng patient retention
- Giảm chi phí marketing để re-engage patient

---

## 5) QA Checklist trước demo

### Technical QA
- [ ] Prototype mở được trên laptop demo
- [ ] Internet/API key hoạt động
- [ ] LLM response time < 3 giây
- [ ] Có data mock backup nếu API lỗi
- [ ] Test ít nhất 5 happy path cases
- [ ] Test ít nhất 3 edge cases

### Content QA
- [ ] `spec-final.md` đã hoàn chỉnh
- [ ] Metrics + threshold rõ ràng
- [ ] Failure modes + mitigation đầy đủ
- [ ] ROI có số liệu cụ thể
- [ ] Demo script dưới 2 phút

### Demo Ops QA
- [ ] Video backup đã record
- [ ] Screenshot các màn hình chính
- [ ] Slides/poster đã export PDF
- [ ] File nộp đã zip đúng format
- [ ] Phân công ai nói gì đã rõ

---

## 6) Demo Ops — Backup Plan

### Plan A: Live demo
- Mở prototype thật
- Chạy flow end-to-end
- Show LLM response thật

### Plan B: Video backup
- Nếu mạng lỗi → play video đã record
- Video dài 60 giây, chỉ phần demo chính

### Plan C: Screenshot walkthrough
- Nếu video không play được
- Show từng màn hình và giải thích flow

### Plan D: Verbal explanation
- Nếu tất cả tech fail
- Giải thích flow bằng lời + vẽ trên giấy

---

## 7) Phần Người 5 nói trong demo (20s cuối)

### Failure mode + mitigation (10s)
`Failure mode lớn nhất là AI có thể hiểu sai thời gian hoặc người cao tuổi khó phản hồi trên app. Vì vậy bọn em có confirm step, multi-channel reminder và caregiver mode để đảm bảo an toàn.`

### Impact + feedback loop (10s)
`Với conservative estimate, giải pháp này có thể giảm 3% missed appointment, tiết kiệm hơn 2 tỷ đồng/năm cho VinMec. Hệ thống còn có feedback loop để học từ hành vi user và cải thiện liên tục.`

---

## 8) File cần nộp — Checklist

### Bắt buộc
- [ ] `spec-final.md` (có đủ canvas, metrics, failure modes, ROI)
- [ ] `prototype-readme.md` (hướng dẫn chạy prototype)
- [ ] Prototype code/link (Figma, GitHub, hoặc deployed link)
- [ ] Demo video hoặc slides

### Bonus
- [ ] Prompt test log
- [ ] User flow diagram
- [ ] Poster/infographic

---

## 9) Timeline cho Người 5

### 9:00 - 9:30
- Đọc kỹ rubric và yêu cầu nộp
- Align với Người 1 về metrics cần đo
- Bắt đầu viết failure modes

### 9:30 - 11:00
- Hoàn thiện metrics table
- Viết ROI 3 scenarios
- Chuẩn bị QA checklist

### 11:00 - 13:00
- Test prototype của Người 4
- Bắt bug và báo team fix
- Record video backup

### 14:00 - 15:30
- Dry run demo ít nhất 2 lần
- Bấm giờ từng phần
- Chuẩn bị backup plan

### 15:30 - 16:00
- Final check tất cả file nộp
- Mở sẵn prototype/video/slides
- Sẵn sàng demo

---

## 10) Câu hỏi thường gặp từ ban giám khảo

### Q1: Làm sao đo được metrics này?
**A:** Trong prototype, em mock data với 10 test cases. Trong production, sẽ log user interaction và đo qua analytics dashboard.

### Q2: Nếu AI sai thì sao?
**A:** Em có 3 lớp safety: (1) AI confirm lại trước khi đặt, (2) user phải xác nhận cuối, (3) có hotline fallback.

### Q3: ROI này có realistic không?
**A:** Em dùng conservative estimate với giả định chỉ giảm 3% missed appointment và chỉ áp dụng cho 30% user. Nếu scale rộng hơn thì ROI còn cao hơn nhiều.

### Q4: Tại sao không automation hoàn toàn?
**A:** Vì đây là bài toán y tế, nếu AI tự đặt sai lịch thì ảnh hưởng sức khỏe. Augmentation approach an toàn hơn và user trust hơn.

---

## 11) Chốt scope nếu thời gian gấp

Nếu không kịp làm đầy đủ, ưu tiên theo thứ tự:

1. **Metrics table** (bắt buộc) — 3 metrics chính + threshold
2. **Top 3 failure modes** (bắt buộc) — mô tả + mitigation
3. **ROI realistic scenario** (bắt buộc) — 1 scenario với số liệu rõ
4. **Video backup** (quan trọng) — record 1 lần chạy thành công
5. **QA checklist** (nếu còn thời gian)

---

## 12) Checklist cuối cho Người 5

- [ ] Có 3 metrics + threshold rõ ràng
- [ ] Có 3 failure modes + mitigation chi tiết
- [ ] Có ROI ít nhất 1 scenario với số liệu
- [ ] Đã test demo ít nhất 2 lần
- [ ] Có video/screenshot backup
- [ ] Chuẩn bị sẵn câu trả lời cho Q&A
- [ ] Biết rõ phần mình nói trong demo 2 phút

---

**Good luck! 🚀**
