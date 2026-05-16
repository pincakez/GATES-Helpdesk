import { NavLink } from "react-router";
import {
  Ticket,
  MessageCircle,
  Mail,
  Tag,
  Shield,
  Star,
  Gift,
  User,
} from "lucide-react";

const navItems = [
  { to: "/app/tickets", icon: Ticket, label: "My Tickets", unread: 0 },
  { to: "/app/live-chat", icon: MessageCircle, label: "Live Chat", unread: 0 },
  { to: "/app/inbox", icon: Mail, label: "Personal Inbox", unread: 1 },
  { to: "/app/offers", icon: Tag, label: "Offers", unread: 0 },
  { to: "/app/warranty", icon: Shield, label: "My Warranty", unread: 0 },
  { to: "/app/loyalty", icon: Star, label: "Loyalty Points", unread: 0 },
  { to: "/app/benefits", icon: Gift, label: "My Benefits", unread: 0 },
  { to: "/app/profile", icon: User, label: "My Profile", unread: 0 },
];

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo — desktop only (mobile shows it in drawer header) */}
      <div className="hidden md:block px-5 py-5 border-b border-gray-100">
        <div className="text-xs font-semibold text-[#166534] tracking-widest uppercase">GATES</div>
        <div className="text-base font-bold text-gray-900">Help Desk</div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, unread }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#166534] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <div className="relative flex-shrink-0">
              <Icon
                size={17}
                className={
                  label === "Personal Inbox" && unread > 0
                    ? "mail-shake"
                    : ""
                }
              />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {unread}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">Customer Service</div>
        <div className="text-sm font-medium text-gray-700">19199</div>
      </div>
    </div>
  );
}
