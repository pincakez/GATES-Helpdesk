import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserPlus, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Save, X, Shield, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ALL_PRIVILEGES = [
  'Dashboard Access',
  'Client Control',
  'Offers Management',
  'Tickets Management',
  'Role Management',
  'Inventory Access',
  'WebRTC Remote',
  'WebRTC Calls',
  'FAQ Builder',
  'Loyalty Points',
  'Waitlist Admin',
  'AI Alerts',
  'AI Rules Config',
];

interface AdminUser {
  id: string;
  name: string;
  email: string;
  activePrivileges: string[];
  alertPreferences: {
    newTickets: { inApp: boolean, whatsapp: boolean, fb: boolean };
    aiIntervention: { inApp: boolean, whatsapp: boolean, fb: boolean };
  }
}

const defaultAlertPrefs = {
  newTickets: { inApp: true, whatsapp: false, fb: false },
  aiIntervention: { inApp: true, whatsapp: false, fb: false }
};

const initialUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Karim Ali (Owner)',
    email: 'karim.ali@company.com',
    activePrivileges: [...ALL_PRIVILEGES],
    alertPreferences: {
      newTickets: { inApp: true, whatsapp: true, fb: false },
      aiIntervention: { inApp: true, whatsapp: true, fb: false }
    }
  },
  {
    id: '2',
    name: 'Ahmed Elsayed',
    email: 'ahmed.elsayed@company.com',
    activePrivileges: ['Dashboard Access', 'Client Control', 'Tickets Management'],
    alertPreferences: defaultAlertPrefs
  },
  {
    id: '3',
    name: 'Nour Hassan',
    email: 'nour.hassan@company.com',
    activePrivileges: ['Tickets Management', 'FAQ Builder'],
    alertPreferences: defaultAlertPrefs
  }
];

export default function Roles() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit State
  const [activeList, setActiveList] = useState<string[]>([]);
  const [inactiveList, setInactiveList] = useState<string[]>([]);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedInactive, setSelectedInactive] = useState<string[]>([]);
  
  // User Edit State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAlerts, setEditAlerts] = useState<AdminUser['alertPreferences']>(defaultAlertPrefs);

  const handleExpand = (user: AdminUser) => {
    if (expandedId === user.id) {
       setExpandedId(null);
       return;
    }
    setExpandedId(user.id);
    setActiveList(user.activePrivileges);
    const inactive = ALL_PRIVILEGES.filter(p => !user.activePrivileges.includes(p));
    setInactiveList(inactive);
    setSelectedActive([]);
    setSelectedInactive([]);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAlerts(user.alertPreferences);
  };

  const handleCreateNew = () => {
    const newUser: AdminUser = {
      id: Date.now().toString(),
      name: 'New Admin User',
      email: 'new.admin@company.com',
      activePrivileges: [],
      alertPreferences: defaultAlertPrefs
    };
    setUsers([...users, newUser]);
    handleExpand(newUser);
  };

  const moveLeft = () => {
     // move from right (inactive) to left (active)
     if (selectedInactive.length === 0) return;
     setActiveList([...activeList, ...selectedInactive]);
     setInactiveList(inactiveList.filter(p => !selectedInactive.includes(p)));
     setSelectedInactive([]);
  };

  const moveRight = () => {
     // move from left (active) to right (inactive)
     if (selectedActive.length === 0) return;
     setInactiveList([...inactiveList, ...selectedActive]);
     setActiveList(activeList.filter(p => !selectedActive.includes(p)));
     setSelectedActive([]);
  };

  const toggleSelectActive = (priv: string) => {
    if (selectedActive.includes(priv)) {
      setSelectedActive(selectedActive.filter(p => p !== priv));
    } else {
      setSelectedActive([...selectedActive, priv]);
    }
  };

  const toggleSelectInactive = (priv: string) => {
    if (selectedInactive.includes(priv)) {
      setSelectedInactive(selectedInactive.filter(p => p !== priv));
    } else {
      setSelectedInactive([...selectedInactive, priv]);
    }
  };

  const handleSave = (userId: string) => {
     setUsers(users.map(u => u.id === userId ? { ...u, name: editName, email: editEmail, activePrivileges: activeList, alertPreferences: editAlerts } : u));
     setExpandedId(null);
  };

  const handleCancel = () => {
     setExpandedId(null);
  };

  return (
    <PageWrapper 
      title="Role Management" 
      description="Manage admin users and configure their specific access privileges."
      action={
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 w-fit shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Create Admin User
        </button>
      }
    >
      <div className="max-w-5xl space-y-4">
        {users.map((user) => {
          const isExpanded = expandedId === user.id;

          return (
            <div key={user.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
              {/* Header (Clickable) */}
              <div 
                className={`p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors ${isExpanded ? 'bg-neutral-800/30' : ''}`}
                onClick={() => handleExpand(user)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-base">{user.name}</span>
                  <span className="text-xs text-neutral-400">{user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-md font-medium border border-neutral-700">
                    {user.activePrivileges.length} Privileges Active
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </div>

              {/* Expansion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Display Name</label>
                          <input 
                            type="text" 
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        
                        {/* Active (Left) */}
                        <div className="flex-1 w-full flex flex-col h-80">
                           <div className="flex items-center gap-2 mb-3 px-1 text-emerald-500 font-semibold text-sm uppercase tracking-wider">
                             <Shield className="w-4 h-4" /> Active Privileges
                           </div>
                           <div className="flex-1 bg-[#0a0a0a] border border-emerald-900/40 rounded-xl overflow-y-auto p-2 space-y-1 shadow-inner">
                              {activeList.map(priv => (
                                <div 
                                  key={priv} 
                                  onClick={() => toggleSelectActive(priv)}
                                  className={`p-3 rounded-lg text-sm cursor-pointer border transition-colors ${selectedActive.includes(priv) ? 'bg-emerald-900/30 border-emerald-500/50 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800'}`}
                                >
                                  {priv}
                                </div>
                              ))}
                              {activeList.length === 0 && (
                                <div className="h-full flex items-center justify-center text-xs text-neutral-600 text-center px-4">
                                  No active privileges assigned
                                </div>
                              )}
                           </div>
                        </div>

                        {/* Controls (Center) */}
                        <div className="flex md:flex-col gap-3 py-4 md:py-0">
                           <button 
                             onClick={moveLeft}
                             disabled={selectedInactive.length === 0}
                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedInactive.length > 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}
                             title="Make Active (Add)"
                           >
                             <ChevronLeft className="w-5 h-5 hidden md:block" />
                             <ChevronUp className="w-5 h-5 md:hidden" />
                           </button>
                           <button 
                             onClick={moveRight}
                             disabled={selectedActive.length === 0}
                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedActive.length > 0 ? 'bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}
                             title="Make Inactive (Remove)"
                           >
                             <ChevronRight className="w-5 h-5 hidden md:block" />
                             <ChevronDown className="w-5 h-5 md:hidden" />
                           </button>
                        </div>

                        {/* Inactive (Right) */}
                        <div className="flex-1 w-full flex flex-col h-80">
                           <div className="flex items-center gap-2 mb-3 px-1 text-neutral-500 font-semibold text-sm uppercase tracking-wider">
                             <ShieldQuestion className="w-4 h-4" /> Inactive Privileges (Available)
                           </div>
                           <div className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-y-auto p-2 space-y-1 shadow-inner">
                              {inactiveList.map(priv => (
                                <div 
                                  key={priv} 
                                  onClick={() => toggleSelectInactive(priv)}
                                  className={`p-3 rounded-lg text-sm cursor-pointer border transition-colors ${selectedInactive.includes(priv) ? 'bg-neutral-700/50 border-neutral-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800'}`}
                                >
                                  {priv}
                                </div>
                              ))}
                              {inactiveList.length === 0 && (
                                <div className="h-full flex items-center justify-center text-xs text-neutral-600 text-center px-4">
                                  All privileges are active
                                </div>
                              )}
                           </div>
                        </div>

                      </div>
                      
                      {/* Alert Routing Preferences */}
                      <div className="mt-8 pt-6 border-t border-neutral-800">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                           Alert Routing (Personal Override)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4">
                           <div>
                             <label className="block text-xs font-semibold text-neutral-300 mb-2">New Ticket Alerts</label>
                             <div className="flex flex-col gap-2">
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.newTickets.inApp} onChange={e => setEditAlerts({...editAlerts, newTickets: {...editAlerts.newTickets, inApp: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Admin Panel (In-App)</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.newTickets.whatsapp} onChange={e => setEditAlerts({...editAlerts, newTickets: {...editAlerts.newTickets, whatsapp: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Personal WhatsApp</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.newTickets.fb} onChange={e => setEditAlerts({...editAlerts, newTickets: {...editAlerts.newTickets, fb: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Personal Facebook</span>
                               </label>
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-semibold text-neutral-300 mb-2">AI Intervention Required</label>
                             <div className="flex flex-col gap-2">
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.aiIntervention.inApp} onChange={e => setEditAlerts({...editAlerts, aiIntervention: {...editAlerts.aiIntervention, inApp: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Admin Panel (In-App)</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.aiIntervention.whatsapp} onChange={e => setEditAlerts({...editAlerts, aiIntervention: {...editAlerts.aiIntervention, whatsapp: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Personal WhatsApp</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="checkbox" className="accent-primary" checked={editAlerts.aiIntervention.fb} onChange={e => setEditAlerts({...editAlerts, aiIntervention: {...editAlerts.aiIntervention, fb: e.target.checked}})} />
                                 <span className="text-xs text-neutral-300">Personal Facebook</span>
                               </label>
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-neutral-800/50">
                        <button 
                          onClick={handleCancel}
                          className="px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSave(user.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg"
                        >
                          <Save className="w-4 h-4" />
                          Save User Changes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
