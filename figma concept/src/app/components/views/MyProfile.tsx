import { User, Mail, Phone, MapPin, Edit2 } from "lucide-react";

export function MyProfile() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#166534] to-[#4ade80] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          أ
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900" dir="rtl">أحمد الرشيدي</h2>
          <p className="text-sm text-gray-500 mt-0.5" dir="rtl">عميل مميز — GATES Plus</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs bg-[#f0fdf4] text-[#166534] font-medium px-2.5 py-0.5 rounded-full">
              عميل من 2022
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-[#166534] transition-colors flex-shrink-0">
          <Edit2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {[
          { icon: User, label: "الاسم بالكامل", value: "أحمد محمد الرشيدي" },
          { icon: Mail, label: "الإيميل", value: "ahmed.rashidi@email.com" },
          { icon: Phone, label: "رقم الموبايل", value: "+20 100 123 4567" },
          { icon: MapPin, label: "العنوان", value: "القاهرة، مدينة نصر، شارع عباس العقاد" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-[#166534]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm text-gray-800 truncate" dir="rtl">{value}</p>
            </div>
            <button className="text-gray-300 hover:text-[#166534] transition-colors flex-shrink-0">
              <Edit2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 py-3 border border-red-200 text-red-500 text-sm rounded-xl hover:bg-red-50 transition-colors">
        تسجيل الخروج
      </button>
    </div>
  );
}
