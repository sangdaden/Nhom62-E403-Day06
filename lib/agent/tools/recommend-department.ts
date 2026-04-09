import { tool } from "ai";
import { z } from "zod";
import { departments } from "@/lib/data";
import { lookupDepartments, FALLBACK_DEPARTMENT_ID, FALLBACK_DEPARTMENT_NAME } from "@/lib/data/symptom-department-map";

export default tool({
  description: `Đề xuất khoa khám phù hợp dựa trên triệu chứng của user.

BẢNG MAPPING TRIỆU CHỨNG → KHOA (BẮT BUỘC tuân thủ, KHÔNG được tự suy luận khác):
- Đau bụng, tiêu chảy, buồn nôn, khó tiêu, ợ hơi, đầy hơi, viêm loét dạ dày → **Khoa Tiêu hóa**
- Đau ngực, hồi hộp, khó thở khi gắng sức, tăng huyết áp, rối loạn nhịp tim → **Khoa Tim mạch**
- Ho, sốt, viêm họng, viêm phổi, khó thở, hen suyễn → **Khoa Hô hấp**
- Đau lưng, đau khớp, đau vai gáy, thoát vị đĩa đệm, gãy xương → **Khoa Cơ Xương Khớp**
- Đau đầu, chóng mặt, mất ngủ, tê bì chân tay, động kinh → **Khoa Thần kinh**
- Trẻ em dưới 16 tuổi với bất kỳ triệu chứng nào → **Khoa Nhi**
- Phụ nữ có thai, khám thai, rối loạn kinh nguyệt → **Khoa Sản phụ khoa**
- Mờ mắt, đau mắt, đỏ mắt → **Khoa Mắt**
- Đau răng, sâu răng, viêm nướu → **Khoa Răng Hàm Mặt**
- Dị ứng da, mụn, nám, eczema → **Khoa Da liễu**

TUYỆT ĐỐI KHÔNG được suggest khoa không có trong bảng trên cho các triệu chứng đã liệt kê. Nếu triệu chứng không match bất kỳ dòng nào → fallback Khoa Nội tổng quát.`,
  inputSchema: z.object({
    symptoms: z.string().describe("Mô tả triệu chứng bằng tiếng Việt"),
    userAge: z.number().optional().describe("Tuổi của user (nếu có)"),
  }),
  execute: async ({ symptoms, userAge }) => {
    // Use explicit rule-based lookup — no LLM sub-reasoning
    const results = lookupDepartments(symptoms, userAge);

    if (results.length === 0) {
      // Fallback: Khoa Nội tổng quát
      const fallback = departments.find((d) => d.id === FALLBACK_DEPARTMENT_ID);
      return [
        {
          id: FALLBACK_DEPARTMENT_ID,
          name: FALLBACK_DEPARTMENT_NAME,
          description: fallback?.description ?? "",
          matchScore: 0,
          matchedKeywords: [],
          note: "Không tìm thấy khoa chính xác theo triệu chứng mô tả. Đây là khoa fallback.",
        },
      ];
    }

    // Return top 3 matches with department details
    return results.slice(0, 3).map((r) => {
      const dept = departments.find((d) => d.id === r.departmentId);
      return {
        id: r.departmentId,
        name: r.departmentName,
        description: dept?.description ?? "",
        matchScore: r.score,
        matchedKeywords: r.matchedKeywords,
      };
    });
  },
});

