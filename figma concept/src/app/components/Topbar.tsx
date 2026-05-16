import { Menu } from "lucide-react";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 border-b border-gray-100 bg-white z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700 hidden sm:block">أحمد الرشيدي</div>
        <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          AA
        </div>
      </div>
    </header>
  );
}
