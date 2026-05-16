import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Box, 
  PhoneCall, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Clock,
  AlertOctagon,
  BrainCircuit,
  MessageCircle,
  MonitorPlay,
  Gift
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Client Control', path: '/client-control', icon: Users },
  { name: 'Messages Control', path: '/messages', icon: MessageCircle },
  { name: 'Offers', path: '/offers', icon: Gift },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
  { name: 'Role Management', path: '/roles', icon: Users },
  { name: 'Inventory', path: '/inventory', icon: Box },
];

const extendedItems = [
  { name: 'Social Inbox', path: '/social-inbox', icon: MessageSquare },
  { name: 'WebRTC Remote', path: '/remote', icon: MonitorPlay },
  { name: 'WebRTC Calls', path: '/calls', icon: PhoneCall },
  { name: 'FAQ Builder', path: '/faq-builder', icon: MessageSquare },
  { name: 'Loyalty Points', path: '/loyalty', icon: Star },
  { name: 'Warranty Check', path: '/warranty', icon: ShieldCheck },
  { name: 'Waitlist', path: '/waitlist', icon: Clock },
];

const integrationItems = [
  { name: 'WhatsApp API', path: '/whatsapp-api', icon: MessageCircle },
  { name: 'Facebook API', path: '/facebook-api', icon: MessageSquare },
];

const aiItems = [
  { name: 'AI Alerts', path: '/alerts', icon: AlertOctagon },
  { name: 'AI Rules Engine', path: '/ai-rules', icon: BrainCircuit },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#0a0a0a] border-r border-neutral-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tracking-tight uppercase text-sm">GATES ADMIN PANEL</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-8">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Core
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>

        <div>
           <div className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Extended Features
          </div>
          <nav className="space-y-1">
            {extendedItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>

        <div>
           <div className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
             AI Agents <span className="bg-emerald-900/30 text-emerald-500 px-1.5 py-0.5 rounded text-[9px] font-bold">NEW</span>
          </div>
          <nav className="space-y-1">
            {aiItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>

        <div>
           <div className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
             Integrations
          </div>
          <nav className="space-y-1">
            {integrationItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-800 flex flex-col gap-4">
        <div className="bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">WebRTC Node</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xs text-neutral-400">TURN Server Active</div>
          <div className="text-[10px] font-mono text-neutral-600 mt-1 uppercase">us-east-4.coturn.io</div>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-200">Admin User</span>
            <span className="text-xs text-neutral-500">Super Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';

const NavItem: React.FC<{ item: { name: string; path: string; icon: any } }> = ({ item }) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group",
          isActive 
            ? "text-primary" 
            : "text-neutral-500 hover:text-neutral-300"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-primary/20 rounded-lg text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Icon className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-primary" : "text-neutral-500 group-hover:text-neutral-300")} />
          <span className="relative z-10">{item.name}</span>
        </>
      )}
    </NavLink>
  );
}
