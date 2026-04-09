import React from "react";
import type { UIMessage } from "ai";
import { isTextUIPart, isToolUIPart, getToolName } from "ai";
import { Avatar } from "@/components/ui-vinmec/Avatar";
import { ToolCallBadge } from "./ToolCallBadge";
import { ActionButtons } from "./ActionButtons";
import { detectActions } from "@/lib/agent/action-detector";
import { FeedbackButtons } from "./FeedbackButtons";
import { MarkdownText } from "./MarkdownText";
import { DoctorCardList } from "./DoctorCardList";
import { SlotChipList } from "./SlotChipList";

interface MessageBubbleProps {
  message: UIMessage;
  isLast?: boolean;
  isStreaming?: boolean;
  onActionClick?: (value: string) => void;
  onSelectDoctor?: (doctorId: string, doctorName: string) => void;
  onSelectSlot?: (datetime: string) => void;
  // Feedback props
  showFeedback?: boolean;
  query?: string;
  toolsUsed?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderToolOutput(
  toolName: string,
  output: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  onSelectDoctor?: (doctorId: string, doctorName: string) => void,
  onSelectSlot?: (datetime: string) => void
) {
  const normalized = toolName.startsWith("tool-") ? toolName.slice(5) : toolName;

  if (normalized === "list_doctors" && Array.isArray(output)) {
    return <DoctorCardList doctors={output} onSelectDoctor={onSelectDoctor} />;
  }

  if (
    normalized === "check_availability" &&
    output &&
    typeof output === "object" &&
    Array.isArray(output.slots)
  ) {
    return <SlotChipList slots={output.slots} doctorId={output.doctorId ?? ""} onSelectSlot={onSelectSlot} />;
  }

  return null;
}

function hasRichToolPart(message: UIMessage): boolean {
  return message.parts.some((part) => {
    if (!isToolUIPart(part) || part.state !== "output-available") return false;
    const name = getToolName(part);
    const normalized = name.startsWith("tool-") ? name.slice(5) : name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = (part as any).output;
    if (normalized === "list_doctors") return Array.isArray(out);
    if (normalized === "check_availability")
      return out && typeof out === "object" && Array.isArray(out.slots);
    return false;
  });
}

/** When cards/chips are present, trim text to the intro sentence only.
 *  Splits on blank line (\n\n) or a newline followed by a bullet/doctor name pattern. */
function trimIntroText(text: string): string {
  // Keep only the first paragraph (up to the first blank line)
  const firstParagraph = text.split(/\n\n/)[0].trim();
  return firstParagraph;
}

function BotContent({
  message,
  isStreaming,
  onSelectDoctor,
  onSelectSlot,
}: {
  message: UIMessage;
  isStreaming?: boolean;
  onSelectDoctor?: (doctorId: string, doctorName: string) => void;
  onSelectSlot?: (datetime: string) => void;
}) {
  // Pre-scan: does this message have DoctorCardList / SlotChipList output?
  const richPresent = hasRichToolPart(message);

  // Collect rich outputs to render AFTER text
  const richOutputs: { key: number; node: React.ReactNode }[] = [];

  // Pass 1 — text bubbles + running/error tool badges only
  const inlineContent = message.parts.map((part, i) => {
    if (part.type === "step-start" || part.type === "reasoning") return null;

    if (isTextUIPart(part)) {
      if (!part.text) return null;
      // When rich cards are present, only keep the intro sentence — discard listing
      const displayText = richPresent ? trimIntroText(part.text) : part.text;
      if (!displayText) return null;
      return (
        <div key={i} className="chat-bubble-bot text-sm leading-relaxed">
          <MarkdownText>{displayText}</MarkdownText>
        </div>
      );
    }

    if (isToolUIPart(part)) {
      const name = getToolName(part);
      const s = part.state;

      if (s === "output-available") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const richNode = renderToolOutput(name, (part as any).output, onSelectDoctor, onSelectSlot);
        if (richNode) {
          // Defer to pass 2 — skip inline rendering
          richOutputs.push({ key: i, node: richNode });
          return null;
        }
      }

      const badgeState =
        s === "output-available" ? "done" : s === "output-error" ? "error" : "running";
      return <ToolCallBadge key={i} toolName={name} state={badgeState} />;
    }

    return null;
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Text bubbles + running/error badges rendered first */}
      {inlineContent}
      {/* Rich UI cards/chips: only shown AFTER streaming is complete */}
      {!isStreaming && richOutputs.map(({ key, node }) => (
        <div key={key}>{node}</div>
      ))}
    </div>
  );
}

function UserContent({ message }: { message: UIMessage }) {
  const texts = message.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
  return (
    <div className="chat-bubble-user max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap">
      {texts}
    </div>
  );
}

export function MessageBubble({
  message,
  isLast = false,
  isStreaming = false,
  onActionClick,
  onSelectDoctor,
  onSelectSlot,
  showFeedback = false,
  query = "",
  toolsUsed = [],
}: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1 animate-fade-in-up">
        <span className="text-xs text-vinmec-text-muted px-1">Bạn</span>
        <UserContent message={message} />
      </div>
    );
  }

  // Extract full text from all text parts for action detection
  const fullText = message.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join(" ");

  const actions =
    isLast && !isStreaming && onActionClick ? detectActions(fullText) : [];

  return (
    <div className="flex items-start gap-2 animate-fade-in-up">
      <Avatar name="Trợ lý ảo" size={32} />
      <div className="flex flex-col gap-1 min-w-0 max-w-[85%]">
        <span className="text-xs text-vinmec-text-muted px-1">
          Trợ lý ảo VinmecCare
        </span>
        <BotContent
          message={message}
          isStreaming={isStreaming}
          onSelectDoctor={onSelectDoctor}
          onSelectSlot={onSelectSlot}
        />
        {actions.length > 0 && onActionClick && (
          <ActionButtons actions={actions} onAction={onActionClick} />
        )}
        {showFeedback && (
          <FeedbackButtons
            messageId={message.id}
            query={query}
            response={fullText}
            toolsUsed={toolsUsed}
          />
        )}
      </div>
    </div>
  );
}
