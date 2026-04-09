"use client";

import { SlotChip } from "./SlotChip";

interface Slot {
  datetime: string; // ISO string
  available: true;
}

interface SlotChipListProps {
  slots: Slot[];
  doctorId: string;
  onSelectSlot?: (datetime: string) => void;
}

const SLOTS_PER_DAY = 6;


function formatDateGroup(isoString: string): string {
  const d = new Date(isoString);
  // Guard: if not a valid date, return the raw string as fallback
  if (isNaN(d.getTime())) return isoString;
  // Lấy ngày/tháng/thứ theo giờ Việt Nam (GMT+7)
  const vnParts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).formatToParts(d);
  const weekday = vnParts.find((p) => p.type === "weekday")?.value ?? "";
  const day = vnParts.find((p) => p.type === "day")?.value ?? "";
  const month = vnParts.find((p) => p.type === "month")?.value ?? "";
  // Chuyển weekday về dạng ngắn T2–T7/CN
  const dowMap: Record<string, string> = {
    "Th 2": "T2", "Th 3": "T3", "Th 4": "T4",
    "Th 5": "T5", "Th 6": "T6", "Th 7": "T7", "CN": "CN",
  };
  const dow = dowMap[weekday] ?? weekday;
  return `${dow} ${day}/${month}`;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  // Guard: if not a valid date, return the raw string as fallback
  if (isNaN(d.getTime())) return isoString;
  // Hiển thị giờ theo múi giờ Việt Nam (GMT+7)
  return d.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function groupByDate(slots: Slot[]): Map<string, Slot[]> {
  const groups = new Map<string, Slot[]>();
  for (const slot of slots) {
    const key = formatDateGroup(slot.datetime);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(slot);
  }
  return groups;
}

export function SlotChipList({ slots, onSelectSlot }: SlotChipListProps) {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-xs text-vinmec-text-muted italic px-1 mt-1">
        Không có lịch trống trong khoảng thời gian này.
      </div>
    );
  }

  const grouped = groupByDate(slots);

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-xs text-vinmec-text-muted font-medium px-0.5">
        {slots.length} khung giờ trống
      </p>

      {Array.from(grouped.entries()).map(([dateLabel, daySlots]) => {
        const limited = daySlots.slice(0, SLOTS_PER_DAY);
        return (
          <div key={dateLabel} className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-vinmec-text-muted">
              {dateLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {limited.map((slot) => (
                <SlotChip
                  key={slot.datetime}
                  datetime={slot.datetime}
                  label={formatTime(slot.datetime)}
                  onSelect={onSelectSlot ? () => onSelectSlot(slot.datetime) : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
