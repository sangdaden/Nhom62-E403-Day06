/**
 * Explicit symptom → department mapping table.
 * This is the SINGLE SOURCE OF TRUTH for recommend-department tool.
 * Never rely on LLM sub-reasoning for this mapping.
 */

export interface SymptomRule {
  /** Keywords to match (already normalised, lower-case, no diacritics) */
  keywords: string[];
  /** Department ID matching departments.json */
  departmentId: string;
  /** Display name shown to user */
  departmentName: string;
}

export const SYMPTOM_RULES: SymptomRule[] = [
  {
    keywords: [
      "dau bung", "tieu chay", "buon non", "kho tieu", "o hoi",
      "day hoi", "viem loet da day", "o chua", "tao bon", "phan co mau",
      "vang da", "non mua",
    ],
    departmentId: "tieu-hoa",
    departmentName: "Khoa Tiêu hóa",
  },
  {
    keywords: [
      "dau nguc", "hoi hop", "kho tho khi gang suc", "tang huyet ap",
      "roi loan nhip tim", "tim dap nhanh", "phu chan", "tim mach",
      "nhanh nhip tim", "nhip tim", "benh tim",
    ],
    departmentId: "tim-mach",
    departmentName: "Khoa Tim mạch",
  },
  {
    keywords: [
      "ho", "sot", "viem hong", "viem phoi", "kho tho", "hen suyen",
      "tho kho khe", "ho ra mau", "so mui", "dau hong", "tuc nguc",
    ],
    departmentId: "ho-hap",
    departmentName: "Khoa Hô hấp",
  },
  {
    keywords: [
      "dau lung", "dau khop", "dau vai gay", "thoat vi dia dem",
      "gay xuong", "sung khop", "cung khop", "dau co", "han che van dong",
      "xuong khop", "co xuong",
    ],
    departmentId: "co-xuong-khop",
    departmentName: "Khoa Cơ xương khớp",
  },
  {
    keywords: [
      "dau dau", "chong mat", "mat ngu", "te bi chan tay", "dong kinh",
      "te bi", "yeu liet", "run tay", "mat tham bang", "mat tri nho",
      "co giat", "noi kho", "nhin doi", "than kinh",
    ],
    departmentId: "than-kinh",
    departmentName: "Khoa Thần kinh",
  },
  {
    keywords: [
      "phu nu co thai", "kham thai", "roi loan kinh nguyet",
      "co thai", "san", "phu khoa", "kinh nguyet",
    ],
    departmentId: "san-phu-khoa",
    departmentName: "Khoa Sản phụ khoa",
  },
  {
    keywords: [
      "mo mat", "dau mat", "do mat", "chay nuoc mat", "nhin doi",
      "mat kho", "choi sang", "nhin thay dom den", "giam thi luc",
    ],
    departmentId: "mat",
    departmentName: "Khoa Mắt",
  },
  {
    keywords: [
      "dau rang", "sau rang", "viem nuou", "rang ham mat", "rang",
    ],
    departmentId: "rang-ham-mat",
    departmentName: "Khoa Răng Hàm Mặt",
  },
  {
    keywords: [
      "di ung da", "mun", "nam", "eczema", "noi man", "ngua da",
      "phat ban", "mun trung ca", "rung toc", "vay nen", "cham",
      "da lieu",
    ],
    departmentId: "da-lieu",
    departmentName: "Khoa Da liễu",
  },
  {
    keywords: [
      "dau hong", "ngat mui", "chay mui", "u tai", "nghe kem",
      "dau tai", "viem xoang", "khan tieng", "nuot dau", "tai mui hong",
    ],
    departmentId: "tai-mui-hong",
    departmentName: "Khoa Tai - Mũi - Họng",
  },
];

/** Fallback when no rule matches */
export const FALLBACK_DEPARTMENT_ID = "noi-tong-quat";
export const FALLBACK_DEPARTMENT_NAME = "Khoa Nội tổng quát";

/**
 * Normalise Vietnamese text: lowercase + remove diacritics.
 * Keeps only ASCII letters + spaces.
 */
export function normalizeVN(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining marks
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rule-based symptom→department lookup.
 * Returns matched department IDs sorted by score (most keywords matched).
 */
export function lookupDepartments(symptoms: string, userAge?: number): {
  departmentId: string;
  departmentName: string;
  matchedKeywords: string[];
  score: number;
}[] {
  const normalised = normalizeVN(symptoms);

  // Children under 16 → Nhi is always boosted
  const isChild = userAge !== undefined && userAge < 16;

  const scored = SYMPTOM_RULES.map((rule) => {
    const matched = rule.keywords.filter((kw) => normalised.includes(kw));
    const score = matched.length;
    return { departmentId: rule.departmentId, departmentName: rule.departmentName, matchedKeywords: matched, score };
  });

  if (isChild) {
    scored.push({
      departmentId: "nhi-khoa",
      departmentName: "Khoa Nhi",
      matchedKeywords: ["tuoi < 16"],
      score: 5,
    });
  }

  const matched = scored.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
  return matched;
}
