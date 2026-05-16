import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Send, Bot, CheckCircle2, MessageSquare, Plus, BrainCircuit, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'ai' | 'agent';
  text: string;
  time: string;
}

interface Thread {
  id: string;
  clientName: string;
  channel: 'whatsapp' | 'facebook' | 'web';
  lastMessage: string;
  time: string;
  aiHandled: boolean;
  messages: ChatMessage[];
}

const mockThreads: Thread[] = [
  {
    id: 't-1',
    clientName: 'Nour Hassan',
    channel: 'whatsapp',
    lastMessage: 'Are the new monitors in stock?',
    time: '10:45 AM',
    aiHandled: true,
    messages: [
      { id: '1', sender: 'client', text: 'Hi, are the new monitors in stock?', time: '10:45 AM' },
      { id: '2', sender: 'ai', text: 'Hello Nour! Yes, we have standard 24" and gaming 27" monitors in stock. Would you like to reserve one?', time: '10:46 AM' },
    ]
  },
  {
    id: 't-2',
    clientName: 'Salma Magdy',
    channel: 'facebook',
    lastMessage: 'Can you assist me with the warranty process?',
    time: 'Yesterday',
    aiHandled: false,
    messages: [
      { id: '1', sender: 'client', text: 'Can you assist me with the warranty process for my Dell laptop?', time: '09:00 AM' },
      { id: '2', sender: 'agent', text: 'Sure! Please provide your phone number so I can pull up your account.', time: '09:05 AM' }
    ]
  }
];

export default function SocialInbox() {
  const [activeThreadId, setActiveThreadId] = useState<string>(mockThreads[0].id);
  const [replyText, setReplyText] = useState('');
  
  const activeThread = mockThreads.find(t => t.id === activeThreadId);

  return (
    <PageWrapper title="Social Inbox" description="Unified inbox for WhatsApp, Facebook, and Web messages.">
      <div className="flex h-[calc(100vh-14rem)] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        
        {/* Threads List */}
        <div className="w-1/3 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h3 className="font-medium text-white text-sm">Active Conversations</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockThreads.map(thread => (
              <div 
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors ${activeThreadId === thread.id ? 'bg-neutral-800/80' : 'hover:bg-neutral-800/40'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-white text-sm">{thread.clientName}</span>
                  <span className="text-[10px] text-neutral-500">{thread.time}</span>
                </div>
                <div className="text-xs text-neutral-400 truncate mb-2">{thread.lastMessage}</div>
                <div className="flex gap-2 items-center">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${thread.channel === 'whatsapp' ? 'bg-green-500/20 text-green-500' : thread.channel === 'facebook' ? 'bg-blue-500/20 text-blue-500' : 'bg-neutral-700 text-neutral-300'}`}>
                    {thread.channel}
                  </span>
                  {thread.aiHandled && (
                    <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                      <BrainCircuit className="w-3 h-3" /> AI Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-black">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold">
                    {activeThread.clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{activeThread.clientName}</h4>
                    <div className="text-xs text-neutral-400 capitalize">{activeThread.channel}</div>
                  </div>
                </div>
                {activeThread.aiHandled && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-medium">
                    <Bot className="w-4 h-4 animate-pulse" />
                    AI is handling this conversation
                  </div>
                )}
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeThread.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === 'client' ? 'items-start' : 'items-end'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.sender === 'client' ? 'text-neutral-500 ml-1' : 'text-primary mr-1'}`}>
                      {msg.sender === 'ai' ? 'AI Assistant' : msg.sender === 'agent' ? 'Human Agent' : 'Client'} - {msg.time}
                    </span>
                    <div className={`text-sm px-4 py-2 rounded-2xl max-w-[80%] ${
                      msg.sender === 'client' 
                        ? 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700' 
                        : msg.sender === 'ai' 
                          ? 'bg-primary/20 text-primary rounded-tr-none border border-primary/30'
                          : 'bg-emerald-600/20 text-emerald-500 rounded-tr-none border border-emerald-600/30'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Compose */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-900">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={activeThread.aiHandled ? "Type to intervene and pause AI..." : "Message client..."}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all"
                  />
                  <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
              Select a thread to view conversation.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
