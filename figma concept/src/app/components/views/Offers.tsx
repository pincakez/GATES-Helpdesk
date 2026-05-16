import { Clock } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "خصم 15% على كل لابتوبات Dell",
    description: "اشتري أي لابتوب Dell من موقعنا وهتاخد خصم 15% فوري على السعر",
    badge: "حصري",
    badgeColor: "bg-[#166534] text-white",
    expiry: "31 مايو 2026",
    discount: "15%",
  },
  {
    id: 2,
    title: "جراب مجاني مع كل لابتوب",
    description: "مع كل لابتوب بتشتريه هتاخد جراب حماية مجاني بالقيمة",
    badge: "محدود",
    badgeColor: "bg-amber-100 text-amber-700",
    expiry: "20 مايو 2026",
    discount: "مجاني",
  },
  {
    id: 3,
    title: "ضمان ممتد 3 سنين بخصم 35%",
    description: "مدّد الضمان على لابتوبك لـ 3 سنين إضافية بخصم يوصل لـ 35%",
    badge: "الأكثر طلباً",
    badgeColor: "bg-blue-100 text-blue-700",
    expiry: "15 يونيو 2026",
    discount: "35%",
  },
  {
    id: 4,
    title: "قسّط بدون فوايد — 12 شهر",
    description: "اشتري لابتوبك دلوقتي وادفع على 12 قسط بدون فوايد",
    badge: "جديد",
    badgeColor: "bg-purple-100 text-purple-700",
    expiry: "30 يونيو 2026",
    discount: "0%",
  },
];

export function Offers() {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-5">عروض متاحة ليك دلوقتي</p>

      <div className="grid gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-[#166534]/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1" dir="rtl">{offer.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3" dir="rtl">{offer.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={11} />
                  <span>ينتهي: {offer.expiry}</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#f0fdf4] flex flex-col items-center justify-center">
                <span className="text-base font-bold text-[#166534] leading-none">{offer.discount}</span>
                <span className="text-[10px] text-[#166534]/70 mt-0.5">خصم</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-[#166534] font-medium border border-[#166534]/30 rounded-lg hover:bg-[#f0fdf4] transition-colors">
              استفد من العرض
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
