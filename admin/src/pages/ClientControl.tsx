import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { 
  Users, UserPlus, Search, Edit2, Trash2, MessageSquare, 
  ShieldCheck, Star, Clock, Laptop, Save, ChevronRight, CheckCircle2, Plus, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ClientType = 'Standard' | 'Silver Client' | 'Premium Client';

interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'system';
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  date: string;
  status: 'Resolved' | 'Escalated' | 'Closed' | 'In Progress';
  agent: string;
  messages: ChatMessage[];
}

const mockChatHistory: Record<string, ChatSession[]> = {
  'C-001': [
    {
      id: 'S-101',
      date: 'March 14, 2026',
      status: 'Resolved',
      agent: 'Support Agent',
      messages: [
        { id: '1', sender: 'client', text: "Hello, I'm having trouble with my recent laptop purchase. It keeps restarting.", time: '10:45 AM' },
        { id: '2', sender: 'agent', text: "Hi Karim, I'm sorry to hear that. Since you are a Premium Client, you have priority support. Let's start a WebRTC remote session to diagnose it.", time: '10:47 AM' },
        { id: '3', sender: 'system', text: "Remote Session Initiated", time: '10:48 AM' },
        { id: '4', sender: 'agent', text: "Ok, I found the issue. It was a driver conflict. I've updated it for you remotely.", time: '11:05 AM' },
        { id: '5', sender: 'client', text: "Wow, that was fast. Thank you!", time: '11:06 AM' }
      ]
    },
    {
      id: 'S-102',
      date: 'January 05, 2026',
      status: 'Closed',
      agent: 'Support Agent',
      messages: [
        { id: '1', sender: 'client', text: "Can I upgrade the RAM on my laptop?", time: '02:15 PM' },
        { id: '2', sender: 'agent', text: "Yes, you can upgrade up to 64GB. We have compatible modules in stock.", time: '02:30 PM' },
      ]
    }
  ],
  'C-002': [
    {
      id: 'S-201',
      date: 'February 20, 2026',
      status: 'Escalated',
      agent: 'L1 Agent',
      messages: [
        { id: '1', sender: 'client', text: "My screen is flickering.", time: '09:00 AM' },
        { id: '2', sender: 'agent', text: "Please try updating your graphics driver.", time: '09:15 AM' },
        { id: '3', sender: 'client', text: "I did, it didn't help.", time: '09:30 AM' },
        { id: '4', sender: 'system', text: "Escalated to L2 Support", time: '09:35 AM' }
      ]
    }
  ]
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  joinDate: string;
  avatar: string;
  devices: number;
  isBlocked?: boolean;
  blockReason?: string;
  blockedUntil?: string | null;
}

const mockClients: Client[] = [
  { id: 'C-001', name: 'Karim Ali', email: 'karim@example.com', phone: '+20 100 123 4567', type: 'Premium Client', joinDate: '2025-11-20', avatar: 'KA', devices: 3, isBlocked: false },
  { id: 'C-002', name: 'Ahmed Elsayed', email: 'ahmed.e@example.com', phone: '+20 111 987 6543', type: 'Silver Client', joinDate: '2026-01-15', avatar: 'AE', devices: 1, isBlocked: true, blockReason: 'Multiple failed payments', blockedUntil: null },
  { id: 'C-003', name: 'Nour Hassan', email: 'nour.h@example.com', phone: '+20 122 333 4444', type: 'Standard', joinDate: '2026-03-05', avatar: 'NH', devices: 2, isBlocked: false },
];

export default function ClientControl() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'warranty'>('details');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const [chatStatusFilter, setChatStatusFilter] = useState<string>('All');
  const [chatAgentFilter, setChatAgentFilter] = useState<string>('All');

  // Block Modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockDurationType, setBlockDurationType] = useState<'hours' | 'days' | 'indefinite'>('indefinite');
  const [blockDurationValue, setBlockDurationValue] = useState<number>(1);

  const activeClient = clients.find(c => c.id === selectedClientId);

  const handleBlockClient = () => {
    if (!activeClient) return;
    
    let blockedUntil = null;
    if (blockDurationType !== 'indefinite') {
      const now = new Date();
      if (blockDurationType === 'hours') {
        now.setHours(now.getHours() + blockDurationValue);
      } else if (blockDurationType === 'days') {
        now.setDate(now.getDate() + blockDurationValue);
      }
      blockedUntil = now.toISOString();
    }

    setClients(clients.map(c => 
      c.id === activeClient.id 
        ? { ...c, isBlocked: true, blockReason, blockedUntil } 
        : c
    ));
    setShowBlockModal(false);
    setBlockReason('');
    setBlockDurationValue(1);
    setBlockDurationType('indefinite');
  };

  const handleUnblockClient = () => {
    if (!activeClient) return;
    setClients(clients.map(c => 
      c.id === activeClient.id 
        ? { ...c, isBlocked: false, blockReason: undefined, blockedUntil: null } 
        : c
    ));
  };
  const clientChatHistory = activeClient ? mockChatHistory[activeClient.id] || [] : [];
  
  const filteredChatHistory = clientChatHistory.filter(session => {
    if (chatStatusFilter !== 'All' && session.status !== chatStatusFilter) return false;
    if (chatAgentFilter !== 'All' && session.agent !== chatAgentFilter) return false;
    return true;
  });

  const activeSession = filteredChatHistory.find(s => s.id === selectedSessionId) || filteredChatHistory[0];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: ClientType) => {
    switch (type) {
      case 'Premium Client': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'Silver Client': return 'bg-slate-400/20 text-slate-300 border-slate-500/30';
      default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <PageWrapper 
      title="Client Control" 
      description="Manage all client data, change member tiers, view chat history, and monitor warranties."
      action={
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Client
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)]">
        
        {/* Sidebar List */}
        <div className="lg:col-span-4 xl:col-span-3 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col overflow-hidden min-h-0">
          <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder-neutral-500"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredClients.map(client => (
              <div 
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 relative ${selectedClientId === client.id ? 'bg-neutral-800 border-l-2 border-primary' : 'hover:bg-neutral-800/50 border-l-2 border-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate flex items-center gap-2">
                    {client.name}
                    {client.isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Account Blocked"></span>}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">{client.email}</div>
                </div>
                {selectedClientId === client.id && <ChevronRight className="w-4 h-4 text-neutral-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Details View */}
        {activeClient ? (
          <div className="lg:col-span-8 xl:col-span-9 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 bg-[#0a0a0a] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-neutral-800 border-[3px] border-neutral-700 flex items-center justify-center text-xl font-medium text-white shadow-lg">
                  {activeClient.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1.5">{activeClient.name}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getTypeColor(activeClient.type)}`}>
                      {activeClient.type}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">ID: {activeClient.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Edit Client">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 border border-red-900/30 bg-red-900/10 text-red-500 hover:bg-red-900/30 rounded transition-colors" title="Delete Client">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-800 bg-[#0a0a0a]/50">
              {[
                { id: 'details', label: 'Client Profile', icon: Users },
                { id: 'chat', label: 'Chat History', icon: MessageSquare },
                { id: 'warranty', label: 'Warranty & Devices', icon: ShieldCheck },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 relative ${
                    activeTab === tab.id ? 'text-primary border-primary bg-primary/5' : 'text-neutral-400 border-transparent hover:text-neutral-300 hover:bg-neutral-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-black relative">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl space-y-8"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">Contact Info</h3>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Email Address</label>
                          <div className="text-sm text-neutral-200">{activeClient.email}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Phone Number</label>
                          <div className="text-sm text-neutral-200">{activeClient.phone}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Join Date</label>
                          <div className="text-sm text-neutral-200">{activeClient.joinDate}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">Account Management</h3>
                        
                        {activeClient.isBlocked && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-red-500 font-medium text-sm mb-1">
                              <AlertOctagon className="w-4 h-4" />
                              Account Blocked
                            </div>
                            <p className="text-xs text-red-400/80 mb-2">Reason: {activeClient.blockReason}</p>
                            <p className="text-xs text-red-400/80 mb-3">
                              Until: {activeClient.blockedUntil ? new Date(activeClient.blockedUntil).toLocaleString() : 'Indefinitely'}
                            </p>
                            <button 
                              onClick={handleUnblockClient}
                              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-red-500"
                            >
                              Unblock Account
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs text-neutral-500 mb-2">Change Client Type</label>
                          <select 
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                            value={activeClient.type}
                            onChange={() => {}} // Hooked up to DB later
                          >
                            <option value="Premium Client">Premium Client</option>
                            <option value="Silver Client">Silver Client</option>
                            <option value="Standard">Standard Client</option>
                          </select>
                        </div>
                        <div className="pt-2 space-y-2">
                           <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors border border-neutral-700">
                             Send Password Reset
                           </button>
                           {!activeClient.isBlocked && (
                             <button 
                               onClick={() => setShowBlockModal(true)}
                               className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded text-sm font-medium transition-colors border border-red-500/30"
                             >
                               Block Account
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex flex-col md:flex-row h-[500px] border border-neutral-800 rounded-xl bg-neutral-900/50 overflow-hidden">
                       {/* Chat Sessions Sidebar */}
                       <div className="w-full md:w-1/3 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
                         <div className="p-3 border-b border-neutral-800 flex flex-col gap-3">
                           <div className="font-semibold text-white text-sm">Past Sessions</div>
                           <div className="flex gap-2">
                             <select 
                               className="bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 rounded px-2 py-1 w-full focus:outline-none focus:border-primary"
                               value={chatStatusFilter}
                               onChange={e => setChatStatusFilter(e.target.value)}
                             >
                               <option value="All">All Status</option>
                               <option value="Resolved">Resolved</option>
                               <option value="Escalated">Escalated</option>
                               <option value="Closed">Closed</option>
                               <option value="In Progress">In Progress</option>
                             </select>
                             <select
                               className="bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 rounded px-2 py-1 w-full focus:outline-none focus:border-primary"
                               value={chatAgentFilter}
                               onChange={e => setChatAgentFilter(e.target.value)}
                             >
                               <option value="All">All Agents</option>
                               {Array.from(new Set(clientChatHistory.map(s => s.agent))).map(agent => (
                                 <option key={agent} value={agent}>{agent}</option>
                               ))}
                             </select>
                           </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-2 space-y-1">
                           {filteredChatHistory.length > 0 ? (
                             filteredChatHistory.map(session => (
                               <div 
                                 key={session.id}
                                 onClick={() => setSelectedSessionId(session.id)}
                                 className={`p-3 rounded-lg cursor-pointer transition-colors relative ${activeSession?.id === session.id ? 'bg-neutral-800 border-l-2 border-primary' : 'hover:bg-neutral-800/50 border-l-2 border-transparent'}`}
                               >
                                 <div className="text-sm text-white font-medium mb-1">{session.date}</div>
                                 <div className="flex justify-between items-center text-xs text-neutral-400">
                                   <span>{session.agent}</span>
                                   <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                     session.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                     session.status === 'Escalated' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                     'bg-neutral-800 text-neutral-500 border border-neutral-700'
                                   }`}>
                                     {session.status}
                                   </span>
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="text-center text-sm text-neutral-600 mt-10">No chat history found.</div>
                           )}
                         </div>
                       </div>
                       
                       {/* Chat Messages Area */}
                       <div className="flex-1 flex flex-col min-w-0 bg-black">
                         {activeSession ? (
                           <>
                             <div className="p-3 border-b border-neutral-800 flex justify-between items-center text-xs text-neutral-400 bg-neutral-900">
                               <span>Archive from {activeSession.date}</span>
                               <span className="flex items-center gap-1">
                                 {activeSession.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                 {activeSession.status}
                               </span>
                             </div>
                             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                               {activeSession.messages.map(msg => (
                                 msg.sender === 'system' ? (
                                   <div key={msg.id} className="flex justify-center my-4">
                                     <div className="bg-neutral-800/50 text-neutral-500 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-neutral-800">
                                        {msg.text} - {msg.time}
                                     </div>
                                   </div>
                                 ) : msg.sender === 'client' ? (
                                   <div key={msg.id} className="flex flex-col items-start gap-1">
                                     <span className="text-[10px] font-bold text-neutral-500 ml-1">Client - {msg.time}</span>
                                     <div className="bg-neutral-800 text-sm text-neutral-200 px-4 py-2 rounded-2xl rounded-tl-none border border-neutral-700 max-w-[85%]">
                                       {msg.text}
                                     </div>
                                   </div>
                                 ) : (
                                   <div key={msg.id} className="flex flex-col items-end gap-1">
                                     <span className="text-[10px] font-bold text-primary mr-1">{activeSession.agent} - {msg.time}</span>
                                     <div className="bg-primary text-sm text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                                       {msg.text}
                                     </div>
                                   </div>
                                 )
                               ))}
                             </div>
                           </>
                         ) : (
                            <div className="flex-1 flex items-center justify-center text-neutral-600 text-sm">
                              Select a session to view messages.
                            </div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'warranty' && (
                  <motion.div 
                    key="warranty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Registered Devices</h3>
                      <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Device & Warranty
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map(device => (
                        <div key={device} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                              <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">MacBook Pro 16" M3 Max</div>
                              <div className="text-xs text-neutral-500 font-mono">SN: C02F893JHX</div>
                            </div>
                          </div>
                          <span className="bg-emerald-900/30 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-neutral-800">
                           <div className="flex justify-between text-xs">
                             <span className="text-neutral-500">Purchase Date</span>
                             <span className="text-neutral-300 font-medium">Nov 20, 2025</span>
                           </div>
                           <div className="flex justify-between text-xs">
                             <span className="text-neutral-500">Warranty Expiration</span>
                             <span className="text-neutral-300 font-medium">Nov 19, 2027</span>
                           </div>
                           <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2">
                             <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                           </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 xl:col-span-9 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center text-neutral-500 min-h-0">
             <Users className="w-12 h-12 mb-4 opacity-50" />
             <p>Select a client to view details</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a] flex justify-between items-center">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-500" />
                  Block Client
                </h3>
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="text-neutral-500 hover:text-white"
                >
                   ✕
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Block Reason</label>
                  <textarea 
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="This reason might be shown to the client on login attempt..."
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all resize-none h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Duration</label>
                  <div className="flex gap-2">
                    <select 
                      value={blockDurationType}
                      onChange={(e) => setBlockDurationType(e.target.value as any)}
                      className="bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 flex-1"
                    >
                      <option value="indefinite">Indefinitely</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                    {blockDurationType !== 'indefinite' && (
                      <input 
                        type="number"
                        min="1"
                        value={blockDurationValue}
                        onChange={(e) => setBlockDurationValue(parseInt(e.target.value) || 1)}
                        className="w-24 bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 text-center"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-800 bg-[#0a0a0a] flex justify-end gap-3">
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockClient}
                  disabled={!blockReason.trim()}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500"
                >
                  Confirm Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
