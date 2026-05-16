import { Zap, Truck, PhoneCall, Wrench, Clock, HeartHandshake } from "lucide-react";

const benefits = [
  { icon: Zap, title: "دعم فني سريع", desc: "ضمان الرد على مشاكل لابتوبك خلال 4 ساعات", active: true },
  { icon: Truck, title: "توصيل مجاني", desc: "توصيل مجاني لأي لابتوب أو إكسسوار لباب بيتك", active: true },
  { icon: PhoneCall, title: "دعم 24/7", desc: "فريق دعم فني متاح طول اليوم والليل", active: true },
  { icon: Wrench, title: "صيانة وقائية", desc: "فحص مجاني للابتوب مرتين في السنة", active: true },
  { icon: Clock, title: "مواعيد مرنة", desc: "احجز موعد صيانة في المسا أو في الويكند", active: false },
  { icon: HeartHandshake, title: "مدير حساب خاص", desc: "شخص مخصص يتابع كل احتياجاتك", active: false },
];

export function MyBenefits() {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-5">
        {benefits.filter(b => b.active).length} من {benefits.length} مزايا شغالة في باقتك
      </p>

      <div className="grid gap-3">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${benefit.active ? "border-gray-100" : "border-gray-100 opacity-55"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${benefit.active ? "bg-[#f0fdf4]" : "bg-gray-100"}`}>
                <Icon size={18} className={benefit.active ? "text-[#166534]" : "text-gray-400"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-gray-900" dir="rtl">{benefit.title}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${benefit.active ? "bg-green-50 text-[#166534]" : "bg-gray-100 text-gray-500"}`}>
                    {benefit.active ? "مفعّل" : "مش متاح"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed" dir="rtl">{benefit.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 bg-[#f0fdf4] rounded-xl border border-[#166534]/15">
        <p className="text-sm text-[#166534] font-medium" dir="rtl">ترقية الباقة</p>
        <p className="text-xs text-[#166534]/70 mt-1 mb-3" dir="rtl">اشترك في GATES Premium وهتاخد كل المزايا</p>
        <button className="w-full py-2 bg-[#166534] text-white text-sm rounded-lg hover:bg-[#14532d] transition-colors">
          اشترك دلوقتي
        </button>
      </div>
    </div>
  );
}
