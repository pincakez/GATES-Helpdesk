interface CustomerBubbleProps {
  content: string;
  timestamp: string;
}

export function CustomerBubble({ content, timestamp }: CustomerBubbleProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        dir="auto"
        className="bg-[#166534] text-white text-sm px-3.5 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] leading-relaxed"
      >
        {content}
      </div>
      <span className="text-[10px] text-gray-400 px-1">{timestamp}</span>
    </div>
  );
}
