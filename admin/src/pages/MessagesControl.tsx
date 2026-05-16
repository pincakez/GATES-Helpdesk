import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Send, MessageSquare, Plus, Bell, MessageCircle, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type MessageTarget = 'all' | 'specific';
type MessageChannel = 'inbox' | 'whatsapp' | 'toast';

interface SentMessage {
  id: string;
  body: string;
  target: MessageTarget;
  clientId?: string;
  channel: MessageChannel;
  createdAt: string;
  status: 'sent' | 'delivered';
}

const mockMessages: SentMessage[] = [
  { id: '1', body: 'New Summer Offers are now available in the store!', target: 'all', channel: 'inbox', createdAt: '2026-05-15 10:00 AM', status: 'delivered' },
  { id: '2', body: 'Your repair has been completed and is ready for pickup.', target: 'specific', clientId: 'Karim Ali', channel: 'whatsapp', createdAt: '2026-05-16 11:30 AM', status: 'sent' },
];

export default function MessagesControl() {
  const [messages, setMessages] = useState<SentMessage[]>(mockMessages);
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  
  // New Message State
  const [target, setTarget] = useState<MessageTarget>('all');
  const [clientId, setClientId] = useState('');
  const [channel, setChannel] = useState<MessageChannel>('inbox');
  const [body, setBody] = useState('');
  
  const handleSendMessage = () => {
    if (!body.trim()) return;
    
    const newMsg: SentMessage = {
      id: Date.now().toString(),
      body,
      target,
      clientId: target === 'specific' ? clientId : undefined,
      channel,
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      status: 'sent'
    };
    
    setMessages([newMsg, ...messages]);
    setShowNewMsgModal(false);
    setBody('');
    setClientId('');
  };

  const getChannelIcon = (ch: MessageChannel) => {
    switch (ch) {
      case 'inbox': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'toast': return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <PageWrapper 
      title="Messages Control" 
      description="Broadcast messages, send WhatsApp notifications, or push real-time toast alerts to users."
      action={
        <button 
          onClick={() => setShowNewMsgModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      }
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
        <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a] flex items-center gap-2">
           <Clock className="w-4 h-4 text-neutral-400" />
           <h3 className="font-medium text-white text-sm">Message History</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className="bg-[#0a0a0a] border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  {getChannelIcon(msg.channel)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white capitalize">{msg.channel}</span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs font-medium bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase tracking-wider">
                      {msg.target === 'all' ? 'All Clients' : `Client: ${msg.clientId}`}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300">{msg.body}</p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-neutral-800 md:border-0">
                <div className="text-xs text-neutral-500 font-mono">{msg.createdAt}</div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" />
                  {msg.status}
                </div>
              </div>
            </motion.div>
          ))}
          {messages.length === 0 && (
             <div className="text-center py-12 text-neutral-500 text-sm">No messages sent yet.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showNewMsgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a] flex justify-between items-center">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Compose Message
                </h3>
                <button 
                  onClick={() => setShowNewMsgModal(false)}
                  className="text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Target Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Recipient Target</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={target === 'all'} 
                        onChange={() => setTarget('all')} 
                        className="accent-primary" 
                      />
                      <span className="text-sm text-neutral-200 font-medium">All Clients</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={target === 'specific'} 
                        onChange={() => setTarget('specific')} 
                        className="accent-primary" 
                      />
                      <span className="text-sm text-neutral-200 font-medium">Specific Client</span>
                    </label>
                  </div>
                  {target === 'specific' && (
                    <input 
                      type="text" 
                      placeholder="Enter Client Name or ID..."
                      value={clientId}
                      onChange={e => setClientId(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all mt-2"
                    />
                  )}
                </div>

                {/* Channel Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Communication Channel</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setChannel('inbox')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${channel === 'inbox' ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-700 hover:bg-neutral-800 text-neutral-400'}`}
                    >
                      <MessageSquare className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">App Inbox</span>
                    </button>
                    <button 
                      onClick={() => setChannel('whatsapp')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${channel === 'whatsapp' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-neutral-700 hover:bg-neutral-800 text-neutral-400'}`}
                    >
                      <MessageCircle className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => setChannel('toast')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${channel === 'toast' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-neutral-700 hover:bg-neutral-800 text-neutral-400'}`}
                    >
                      <Bell className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">Live Toast</span>
                    </button>
                  </div>
                  {channel === 'toast' && (
                     <p className="text-[10px] text-amber-500 mt-1">Toast messages will appear via polling to currently active online users immediately.</p>
                  )}
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Message Content</label>
                  <textarea 
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full h-32 bg-[#0a0a0a] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

              </div>
              
              <div className="p-4 border-t border-neutral-800 bg-[#0a0a0a] flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewMsgModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!body.trim() || (target === 'specific' && !clientId.trim())}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,113,197,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  Dispatch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
