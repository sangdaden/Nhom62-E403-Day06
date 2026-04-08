# AI Health Assistant - User Flow Diagram

## Flow chính (Mermaid)

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[1. Hệ thống phát hiện<br/>bệnh nhân sắp đến hạn tái khám<br/>còn 7 ngày]
    
    A --> B[2. AI gửi nhắc nhở<br/>qua App/SMS/Zalo<br/>'Cô có lịch tái khám tim mạch<br/>với BS Nguyễn Văn A vào 20/4.<br/>Cô muốn giữ lịch hay đặt lại?']
    
    B --> C{3. Bệnh nhân<br/>trả lời?}
    
    C -->|Không trả lời| B1[Nhắc lại sau 2 ngày<br/>hoặc gửi cho người thân]
    B1 --> C
    
    C -->|Trả lời: Giữ lịch| End1([Kết thúc:<br/>Nhắc lại trước 1 ngày])
    
    C -->|Trả lời: Đặt lại<br/>'Đặt lại giúp con<br/>chiều thứ 6 tuần sau'| D[4. AI hiểu ý định<br/>- Muốn đổi lịch<br/>- Thời gian: chiều thứ 6 tuần sau<br/>- Khoa: tim mạch<br/>- Bác sĩ: BS Nguyễn Văn A]
    
    D --> E[5. AI kiểm tra slot<br/>Gọi backend/database<br/>hoặc dùng data giả]
    
    E --> F{Có slot<br/>trống?}
    
    F -->|Không có| F1[AI: 'Xin lỗi cô,<br/>khung giờ này đã hết.<br/>Cô có thể chọn<br/>thời gian khác không?']
    F1 --> C
    
    F -->|Có slot| G[6. AI đề xuất 2-3 slot<br/>'Em tìm được 3 khung giờ:<br/>1. Thứ 6, 26/4 - 14:30<br/>2. Thứ 6, 26/4 - 15:00<br/>3. Thứ 6, 26/4 - 16:00<br/>Cô chọn khung nào ạ?']
    
    G --> H[7. Bệnh nhân chọn<br/>'Chọn khung 2 nhé']
    
    H --> I[8. AI xác nhận<br/>'Em xác nhận lại:<br/>Thứ 6, 26/4 lúc 15:00,<br/>khám tim mạch với BS Nguyễn Văn A.<br/>Cô đồng ý chứ ạ?']
    
    I --> J{9. Bệnh nhân<br/>xác nhận?}
    
    J -->|Không đồng ý<br/>'Đổi lại'| G
    
    J -->|Đồng ý| K[10. Hệ thống đặt lịch thành công<br/>'Đã đặt lịch thành công!<br/>Em sẽ nhắc cô lại trước 1 ngày.<br/>Cô muốn nhận nhắc qua kênh nào?<br/>App/SMS/Zalo']
    
    K --> L[11. Nhắc lại trước giờ khám<br/>Gửi nhắc 1 ngày trước:<br/>'Nhắc cô ngày mai 15:00<br/>có lịch khám tim mạch']
    
    L --> M[12. Ghi nhận feedback<br/>- Cô có đến khám không?<br/>- Thích nhắc qua kênh nào?<br/>- Thích nhắc buổi sáng/chiều?]
    
    M --> N[Lưu preference<br/>để lần sau nhắc tốt hơn]
    
    N --> End2([Kết thúc])
    
    style Start fill:#90EE90
    style End1 fill:#87CEEB
    style End2 fill:#87CEEB
    style C fill:#FFE4B5
    style F fill:#FFE4B5
    style J fill:#FFE4B5
    style D fill:#E6E6FA
    style E fill:#E6E6FA
    style G fill:#FFB6C1
    style I fill:#FFB6C1
    style K fill:#98FB98
    style M fill:#DDA0DD
```

## Giải thích màu sắc

- 🟢 **Xanh lá nhạt**: Điểm bắt đầu/kết thúc
- 🟡 **Vàng nhạt**: Điểm quyết định (decision point)
- 🟣 **Tím nhạt**: AI xử lý logic
- 🔴 **Hồng**: AI tương tác với user
- 🟢 **Xanh lá đậm**: Thành công
- 🟣 **Tím đậm**: Thu thập feedback

## Flow đơn giản hóa (cho demo 2 phút)

```mermaid
flowchart LR
    A[Nhắc lịch] --> B[User trả lời<br/>tự nhiên]
    B --> C[AI hiểu<br/>ý định]
    C --> D[AI gợi ý<br/>2-3 slot]
    D --> E[User<br/>xác nhận]
    E --> F[Đặt lịch<br/>thành công]
    F --> G[Nhắc lại<br/>đa kênh]
    
    style A fill:#FFB6C1
    style B fill:#87CEEB
    style C fill:#E6E6FA
    style D fill:#FFB6C1
    style E fill:#87CEEB
    style F fill:#98FB98
    style G fill:#DDA0DD
```

## Các failure points cần test (cho Người 5)

```mermaid
flowchart TD
    Start([Flow bắt đầu]) --> FP1{Failure Point 1:<br/>AI hiểu sai<br/>thời gian?}
    
    FP1 -->|Sai| Fail1[❌ Đặt nhầm ngày/giờ<br/>→ Mitigation: Confirm lại]
    FP1 -->|Đúng| FP2{Failure Point 2:<br/>Không có slot<br/>phù hợp?}
    
    FP2 -->|Không có| Fail2[❌ User thất vọng<br/>→ Mitigation: Gợi ý thời gian khác]
    FP2 -->|Có| FP3{Failure Point 3:<br/>User không<br/>phản hồi?}
    
    FP3 -->|Không phản hồi| Fail3[❌ Bỏ lỡ lịch<br/>→ Mitigation: Multi-channel<br/>+ caregiver mode]
    FP3 -->|Phản hồi| Success[✅ Thành công]
    
    style Fail1 fill:#FFB6C1
    style Fail2 fill:#FFB6C1
    style Fail3 fill:#FFB6C1
    style Success fill:#90EE90
```

---

