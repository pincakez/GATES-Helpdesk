interface ThinkingIndicatorProps {
  text?: string;
}

export function ThinkingIndicator({ text = "بفكر معاك..." }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm w-fit">
      <span className="text-xs text-gray-500" dir="rtl">{text}</span>
      <span className="flex gap-0.5 items-center">
        <span className="thinking-dot w-1 h-1 rounded-full bg-[#166534] inline-block" style={{ animationDelay: "0ms" }} />
        <span className="thinking-dot w-1 h-1 rounded-full bg-[#166534] inline-block" style={{ animationDelay: "160ms" }} />
        <span className="thinking-dot w-1 h-1 rounded-full bg-[#166534] inline-block" style={{ animationDelay: "320ms" }} />
      </span>
    </div>
  );
}
