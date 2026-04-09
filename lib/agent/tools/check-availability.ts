import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { generateSlots, addDays, formatVNDateTime } from "@/lib/utils/datetime";

export default tool({
  description:
    "Kiểm tra các khung giờ còn trống của một bác sĩ trong khoảng ngày xác định.",
  inputSchema: z.object({
    doctorId: z.string().describe("ID của bác sĩ"),
    fromDate: z.string().describe("Ngày bắt đầu tìm kiếm, định dạng YYYY-MM-DD"),
    days: z.number().default(7).describe("Số ngày cần kiểm tra (mặc định 7)"),
  }),
  execute: async ({ doctorId, fromDate, days }) => {
    const now = new Date();
    const start = new Date(fromDate);
    start.setUTCHours(0, 0, 0, 0); // ← dùng UTC để tránh bug timezone
    const end = addDays(start, days);

    console.log(`[check-availability] doctorId=${doctorId} fromDate=${fromDate} days=${days}`);
    console.log(`[check-availability] start=${start.toISOString()} end=${end.toISOString()} now=${now.toISOString()}`);

    // Fetch booked appointments for this doctor in range
    const booked = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: { gte: start, lt: end },
        status: { in: ["booked", "rescheduled"] },
      },
      select: { scheduledAt: true },
    });

    const bookedTimes = new Set(booked.map((a) => a.scheduledAt.toISOString()));
    console.log(`[check-availability] booked count=${booked.length}`);

    // Generate all possible slots
    const availableSlots: { datetime: string; displayTime: string; available: true }[] = [];
    let current = new Date(start);
    let dayCount = 0;

    while (current < end && availableSlots.length < 20) {
      const dayOfWeek = current.getDay();
      const slots = generateSlots(current);
      const futureSlots = slots.filter(s => s > now);
      console.log(`[check-availability] day ${++dayCount}: ${current.toISOString()} dow=${dayOfWeek} totalSlots=${slots.length} futureSlots=${futureSlots.length}`);
      // Skip Sunday (0)
      if (dayOfWeek !== 0) {
        for (const slot of slots) {
          if (slot <= now) continue; // skip past slots
          const iso = slot.toISOString();
          if (!bookedTimes.has(iso)) {
            availableSlots.push({
              datetime: iso,
              displayTime: formatVNDateTime(slot), // giờ VN để AI dùng khi viết text
              available: true,
            });
            if (availableSlots.length >= 20) break;
          }
        }
      }
      current = addDays(current, 1);
    }

    console.log(`[check-availability] result: ${availableSlots.length} available slots`);
    return { doctorId, slots: availableSlots };
  },
});
