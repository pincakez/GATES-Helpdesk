import { Paperclip } from "lucide-react";

const emails = [
  {
    id: 1,
    from: "خدمة عملاء GATES",
    subject: "تحديث على تذكرتك #GH-2041 — اللابتوب بيتعلق",
    preview: "عايزين نعلمك إن الفني اتواصل معانا وهيتصل بيك خلال 24 ساعة عشان يحدد موعد...",
    date: "النهارده، 9:15 ص",
    unread: true,
    hasAttachment: false,
  },
  {
    id: 2,
    from: "فريق الضمان",
    subject: "تجديد ضمان Dell XPS 15 بتاعك",
    preview: "ضمان اللابتوب بتاعك هينتهي خلال 30 يوم. قدر تجدده بسهولة من خلال...",
    date: "امبارح",
    unread: false,
    hasAttachment: true,
  },
  {
    id: 3,
    from: "عروض GATES",
    subject: "خصم 15% على اللابتوبات الجديدة — عرض محدود!",
    preview: "استمتع بخصم 15% على أحدث موديلات Dell و HP و Lenovo — العرض لحد نهاية الشهر...",
    date: "12 مايو",
    unread: false,
    hasAttachment: false,
  },
  {
    id: 4,
    from: "برنامج الولاء",
    subject: "مبروك! ربحت 500 نقطة ولاء",
    preview: "شكراً لشرائك من GATES. اكتسبت 500 نقطة ولاء تقدر تستخدمها في شراءاتك القادمة...",
    date: "10 مايو",
    unread: false,
    hasAttachment: false,
  },
];

export function PersonalInbox() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs bg-[#166534] text-white px-2 py-0.5 rounded-full font-medium">1 جديد</span>
      </div>

      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`bg-white rounded-xl border px-5 py-4 cursor-pointer transition-all hover:shadow-sm ${
              email.unread ? "border-[#166534]/25 shadow-sm" : "border-gray-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${email.unread ? "bg-[#166534]" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className={`text-sm ${email.unread ? "font-semibold text-gray-900" : "text-gray-700"}`} dir="rtl">
                    {email.from}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{email.date}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className={`text-sm truncate ${email.unread ? "font-medium text-gray-800" : "text-gray-600"}`} dir="rtl">
                    {email.subject}
                  </p>
                  {email.hasAttachment && <Paperclip size={12} className="text-gray-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 truncate" dir="rtl">{email.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
