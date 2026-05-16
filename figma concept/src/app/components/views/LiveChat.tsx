import { MessageCircle } from "lucide-react";

export function LiveChat() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center mb-4">
        <MessageCircle size={28} className="text-[#166534]" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-2">Live Chat with Sara</h2>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Sara, your smart GATES assistant, is ready to help you. Open the chat panel on the right to start a conversation.
      </p>
      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#f0fdf4] rounded-full">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-sm text-[#166534] font-medium">Sara is online</span>
      </div>
    </div>
  );
}
