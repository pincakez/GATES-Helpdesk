import { Star, TrendingUp } from "lucide-react";

const transactions = [
  { id: 1, desc: "شراء Dell XPS 15", points: 1200, type: "earn", date: "12 مايو 2026" },
  { id: 2, desc: "تجديد ضمان HP Spectre", points: 500, type: "earn", date: "10 مايو 2026" },
  { id: 3, desc: "استبدال نقاط — خصم على إكسسوار", points: -300, type: "redeem", date: "5 مايو 2026" },
  { id: 4, desc: "شراء ماوس لاسلكي Logitech", points: 150, type: "earn", date: "28 أبريل 2026" },
  { id: 5, desc: "مكافأة العميل المميز", points: 1000, type: "earn", date: "1 أبريل 2026" },
];

const totalPoints = transactions.reduce((acc, t) => acc + t.points, 0);

export function LoyaltyPoints() {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-[#166534] to-[#15803d] rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="fill-white" />
          <span className="text-sm font-medium opacity-90">رصيد نقاط الولاء</span>
        </div>
        <div className="text-4xl font-bold mb-1">{totalPoints.toLocaleString()}</div>
        <div className="text-sm opacity-75">نقطة متاحة للاستبدال</div>
        <div className="flex gap-3 mt-5">
          <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            استبدل النقاط
          </button>
          <button className="flex-1 py-2 bg-white text-[#166534] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            اكسب أكتر
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-[#166534]" />
        <span className="text-sm font-semibold text-gray-800">سجل المعاملات</span>
      </div>

      <div className="space-y-2">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800" dir="rtl">{t.desc}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.date}</p>
            </div>
            <span className={`text-sm font-bold ${t.type === "earn" ? "text-[#166534]" : "text-red-500"}`}>
              {t.type === "earn" ? "+" : ""}{t.points.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
