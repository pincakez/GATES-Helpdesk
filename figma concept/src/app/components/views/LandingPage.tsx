import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Eye, EyeOff, Shield, Zap, HeartHandshake } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ahmed@email.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/app/tickets");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[#166534] tracking-widest uppercase">GATES</div>
          <div className="text-sm font-bold text-gray-900 -mt-0.5">Help Desk</div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-[#166534] text-white text-sm font-medium rounded-lg hover:bg-[#14532d] transition-colors"
        >
          تسجيل الدخول
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#166534] rounded-full" />
            <span className="text-xs text-[#166534] font-medium">بوابة خدمة العملاء الذكية</span>
          </div>

          <h1 className="text-gray-900 mb-4">
            مرحباً بك في <span className="text-[#166534]">GATES Help Desk</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            منصة متكاملة لإدارة طلبات الصيانة والضمان، مع مساعد ذكي يعمل على مدار الساعة
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-[#166534] text-white text-sm font-medium rounded-xl hover:bg-[#14532d] transition-colors shadow-sm"
          >
            ابدأ الآن
          </button>

          <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg mx-auto">
            {[
              { icon: Shield, title: "ضمان آمن", desc: "تتبع ضمان أجهزتك بسهولة" },
              { icon: Zap, title: "استجابة سريعة", desc: "دعم فني في 4 ساعات" },
              { icon: HeartHandshake, title: "مساعد ذكي", desc: "Sara متاحة 24/7" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-[#166534]" />
                </div>
                <p className="text-xs font-semibold text-gray-800 mb-1" dir="rtl">{title}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed" dir="rtl">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-7">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <div className="text-xs font-semibold text-[#166534] tracking-widest uppercase mb-0.5">GATES</div>
              <h2 className="text-gray-900">تسجيل الدخول</h2>
              <p className="text-sm text-gray-500 mt-1">أدخل بيانات حسابك للمتابعة</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5" dir="rtl">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#166534] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1.5" dir="rtl">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#166534] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#166534] text-white text-sm font-medium rounded-lg hover:bg-[#14532d] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
