import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { CustomerBubble } from "./CustomerBubble";
import { AiBubble } from "./AiBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface Message {
  id: string;
  type: "customer" | "ai";
  content: string;
  timestamp: string;
  image?: string;
  table?: { headers: string[]; rows: string[][] };
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "customer",
    content: "السلام عليكم، أنا عايز أعرف إيه أحسن لابتوب للشغل والديزاين؟",
    timestamp: "10:30 ص",
  },
  {
    id: "2",
    type: "ai",
    content: "وعليكم السلام! أهلاً بيك 😊 طيب، عشان أنصحك صح — الشغل على إيه بالظبط؟ فوتوشوب وإليستريتور؟ ولا فيديو كمان؟",
    timestamp: "10:30 ص",
  },
  {
    id: "3",
    type: "customer",
    content: "فوتوشوب وإليستريتور بشكل أساسي، وأحياناً بريمير",
    timestamp: "10:31 ص",
  },
  {
    id: "4",
    type: "ai",
    content: "تمام! على الميزانية دي، عندنا 3 خيارات ممتازين. خليني أقارنهملك:",
    timestamp: "10:31 ص",
    table: {
      headers: ["اللابتوب", "المعالج", "الرام", "الكارت", "السعر"],
      rows: [
        ["Dell XPS 15", "Core i7-13700H", "32GB", "RTX 4060", "45,000 جنيه"],
        ["MacBook Pro M3", "Apple M3 Pro", "18GB", "Unified", "52,000 جنيه"],
        ["ASUS ProArt 16", "Ryzen 9 7945HX", "32GB", "RTX 4070", "48,000 جنيه"],
      ],
    },
  },
  {
    id: "5",
    type: "customer",
    content: "الـ Dell XPS بيبان كويس، ممكن أشوف صورته؟",
    timestamp: "10:33 ص",
  },
  {
    id: "6",
    type: "ai",
    content: "اتفضل! ده Dell XPS 15 — شاشته OLED بـ 3.5K وبيديك ألوان خرافية للتصميم 🔥",
    timestamp: "10:33 ص",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=280&fit=crop",
  },
];

const aiResponses = [
  "سؤال كويس! دي معلومة مهمة جداً. خليني أشوف الموضوع ده عندنا وأرجعلك بأحسن إجابة 😊",
  "تمام! فاهمك. الموضوع ده عندنا ليه أكتر من حل — هقولك على الأنسب ليك.",
  "والله سؤالك وقّع في مكانه! في تفاصيل مهمة لازم تعرفها قبل ما تاخد القرار ده.",
  "أيوه! ده موجود عندنا. عايزني أبعتلك المواصفات الكاملة ولا عايز تعرف السعر الأول؟",
  "بصراحة؟ ده سؤال كتير ناس بيسألوه! هرد عليك بالتفصيل الملل.",
];

function formatTime() {
  return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const customerMsg: Message = {
      id: Date.now().toString(),
      type: "customer",
      content: text,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, customerMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sara header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#166534] to-[#4ade80] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            S
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Sara</div>
          <div className="text-[11px] text-gray-500" dir="rtl">مساعدة GATES الذكية</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-[#f8f9fb]">
        {messages.map((msg) =>
          msg.type === "customer" ? (
            <CustomerBubble key={msg.id} content={msg.content} timestamp={msg.timestamp} />
          ) : (
            <AiBubble
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              image={msg.image}
              table={msg.table}
            />
          )
        )}
        {thinking && (
          <div className="flex flex-col items-start">
            <ThinkingIndicator text="بفكر معاك..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 bg-[#f8f9fb] rounded-xl px-3 py-2 border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك هنا..."
            dir="auto"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || thinking}
            className="w-7 h-7 rounded-lg bg-[#166534] hover:bg-[#14532d] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
