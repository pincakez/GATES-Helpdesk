import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const tickets = [
  { id: "GH-2041", subject: "اللابتوب بيتعلق ومش بيقفل صح", status: "open", priority: "high", date: "12 مايو 2026", category: "Dell XPS 15" },
  { id: "GH-2035", subject: "الشاشة فيها خطوط وبتبرق", status: "in-progress", priority: "medium", date: "10 مايو 2026", category: "HP Spectre x360" },
  { id: "GH-2029", subject: "البطارية بتخلص بسرعة جداً", status: "resolved", priority: "low", date: "5 مايو 2026", category: "MacBook Pro M3" },
  { id: "GH-2021", subject: "الكيبورد مش شغال صح — حرف الـ A بايظ", status: "closed", priority: "low", date: "28 أبريل 2026", category: "Lenovo ThinkPad" },
  { id: "GH-2018", subject: "اللابتوب بيسخن جداً أثناء الشغل", status: "open", priority: "high", date: "25 أبريل 2026", category: "ASUS ROG" },
];

const statusConfig = {
  open: { label: "مفتوح", color: "bg-blue-50 text-blue-700", icon: AlertCircle },
  "in-progress": { label: "قيد المعالجة", color: "bg-amber-50 text-amber-700", icon: Clock },
  resolved: { label: "اتحل", color: "bg-green-50 text-green-700", icon: CheckCircle },
  closed: { label: "مغلق", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

const priorityConfig = {
  high: { label: "عالية", color: "text-red-600" },
  medium: { label: "متوسطة", color: "text-amber-600" },
  low: { label: "منخفضة", color: "text-gray-500" },
};

export function MyTickets() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">عندك {tickets.filter(t => t.status === "open").length} تذاكر مفتوحة</p>
        <button className="px-4 py-2 bg-[#166534] text-white text-sm rounded-lg hover:bg-[#14532d] transition-colors">
          + تذكرة جديدة
        </button>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => {
          const status = statusConfig[ticket.status as keyof typeof statusConfig];
          const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:border-[#166534]/20 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{ticket.category}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate" dir="rtl">{ticket.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{ticket.date}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                  <span className={`text-xs font-medium ${priority.color}`}>
                    أولوية {priority.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
