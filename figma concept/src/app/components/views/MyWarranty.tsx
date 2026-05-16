import { CheckCircle, AlertTriangle } from "lucide-react";

const warranties = [
  {
    id: 1,
    product: "Dell XPS 15 (9530)",
    model: "Core i9 / RTX 4060 / 32GB RAM",
    purchaseDate: "10 مايو 2024",
    expiryDate: "10 مايو 2027",
    status: "active",
    daysLeft: 720,
    coverage: "ضمان شامل — هاردوير وسوفتوير",
  },
  {
    id: 2,
    product: "HP Spectre x360 14",
    model: "Core i7 / Intel Iris Xe / 16GB RAM",
    purchaseDate: "3 مارس 2024",
    expiryDate: "3 مارس 2026",
    status: "active",
    daysLeft: 290,
    coverage: "قطع الغيار والعمالة",
  },
  {
    id: 3,
    product: "Lenovo ThinkPad X1 Carbon",
    model: "Core i5 / Intel UHD / 8GB RAM",
    purchaseDate: "15 يناير 2022",
    expiryDate: "15 يناير 2024",
    status: "expired",
    daysLeft: 0,
    coverage: "قطع الغيار فقط",
  },
];

export function MyWarranty() {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-5">{warranties.filter(w => w.status === "active").length} لابتوبات شاملين ضمان</p>

      <div className="space-y-4">
        {warranties.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border p-5 ${item.status === "active" ? "border-gray-100" : "border-red-100"}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.product}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.model}</p>
              </div>
              {item.status === "active" ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full flex-shrink-0">
                  <CheckCircle size={12} className="text-[#166534]" />
                  <span className="text-xs text-[#166534] font-medium">ساري</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-full flex-shrink-0">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-xs text-red-500 font-medium">منتهي</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <p className="text-gray-400">تاريخ الشراء</p>
                <p className="font-medium text-gray-700 mt-0.5">{item.purchaseDate}</p>
              </div>
              <div>
                <p className="text-gray-400">انتهاء الضمان</p>
                <p className={`font-medium mt-0.5 ${item.status === "active" ? "text-gray-700" : "text-red-500"}`}>
                  {item.expiryDate}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">نوع التغطية</p>
                <p className="font-medium text-gray-700 mt-0.5" dir="rtl">{item.coverage}</p>
              </div>
            </div>

            {item.status === "active" && (
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                  <span dir="rtl">متبقي {item.daysLeft} يوم</span>
                  <span>{Math.min(100, Math.round((item.daysLeft / 1095) * 100))}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#166534] rounded-full"
                    style={{ width: `${Math.min(100, Math.round((item.daysLeft / 1095) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {item.status === "expired" && (
              <button className="w-full mt-3 py-2 text-sm text-[#166534] font-medium border border-[#166534]/30 rounded-lg hover:bg-[#f0fdf4] transition-colors">
                جدّد الضمان
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
