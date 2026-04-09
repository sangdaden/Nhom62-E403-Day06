export type DetectedAction = {
  label: string;
  value: string;
  variant?: "primary" | "secondary";
};

export function detectActions(text: string): DetectedAction[] {
  const actions: DetectedAction[] = [];
  const normalized = text.toLowerCase();

  // Pattern 1: "anh có muốn X không" → Yes/No
  if (/anh có muốn|chị có muốn|em có muốn|bạn có muốn/.test(normalized)) {
    actions.push(
      {
        label: "Có, tiếp tục",
        value: "Có, tiếp tục giúp tôi",
        variant: "primary",
      },
      {
        label: "Không, cảm ơn",
        value: "Không, cảm ơn tôi",
        variant: "secondary",
      }
    );
  }

  // Pattern 2: "xác nhận đặt lịch" → Confirm / Cancel
  else if (/xác nhận đặt|xác nhận booking|confirm/.test(normalized)) {
    actions.push(
      {
        label: "Xác nhận đặt lịch",
        value: "Xác nhận đặt lịch",
        variant: "primary",
      },
      {
        label: "Huỷ",
        value: "Huỷ, tôi suy nghĩ thêm",
        variant: "secondary",
      }
    );
  }

  // Pattern 3: "gọi cấp cứu 115" → Emergency call
  else if (/cấp cứu 115|gọi 115/.test(normalized)) {
    actions.push({
      label: "📞 Gọi 115",
      value: "tel:115",
      variant: "primary",
    });
  }

  return actions;
}
