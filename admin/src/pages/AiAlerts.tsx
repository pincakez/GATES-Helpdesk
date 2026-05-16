import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { AlertOctagon, MessageSquareWarning, X, User, Bot, AlertTriangle, MessageCircle, Send } from 'lucide-react';

const mockAlerts = [
  { id: 1, type: 'price', title: 'Price Complaint', status: 'Live', user: 'Mahmoud Fathy', match: '"your prices are too high"', time: 'Just now', priority: 'medium' },
  { id: 2, type: 'escalation', title: 'Human Escalation Request', status: 'Pending', user: 'Karim Ali', match: '"I need to speak to a real person"', time: '2 mins ago', priority: 'high' },
  { id: 3, type: 'profanity', title: 'Policy Violation - Profanity', status: 'Live', user: 'Omar Khaled', match: '"[Filtered Word]"', time: '5 mins ago', priority: 'high' },
];

export default function AiAlerts() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const activeAlert = mockAlerts.find(a => a.id === selectedChat);

  return (
    <PageWrapper 
      title="AI Agents Alerts" 
      description="Monitor AI agent conversations that require human attention or have triggered safety rules."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between mb-2">
             <div className="text-sm font-semibold text-white">Active Alerts</div>
             <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">3 New</span>
          </div>

          {mockAlerts.map(alert => (
            <div 
              key={alert.id}
              onClick={() => setSelectedChat(alert.id)}
              className={`bg-neutral-900 border p-4 rounded-xl cursor-pointer transition-all ${selectedChat === alert.id ? 'border-primary shadow-[0_0_15px_rgba(5,150,105,0.1)]' : 'border-neutral-800 hover:border-neutral-700'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {alert.type === 'profanity' ? (
                    <MessageSquareWarning className="w-4 h-4 text-red-500" />
                  ) : alert.type === 'escalation' ? (
                    <AlertOctagon className="w-4 h-4 text-orange-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm font-semibold text-neutral-200">{alert.title}</span>
                </div>
                {alert.status === 'Live' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-900/20 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-400 mb-3 block">User: <span className="text-neutral-300">{alert.user}</span></div>
              <div className="text-xs font-mono bg-neutral-800 text-neutral-300 p-2 rounded mb-3">
                 Trigger: <span className="text-red-400">{alert.match}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500">
                 <span>{alert.time}</span>
                 <button className="text-primary hover:text-primary-hover font-bold uppercase">View Chat</button>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Demo */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
          {selectedChat === 1 ? (
            <>
              <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    Live Session: Mahmoud Fathy
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Rule Triggered: Price Objection. Agent Mode: Negotiation / De-escalation</p>
                </div>
                <button onClick={() => setSelectedChat(null)} className="text-neutral-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-[#0a0a0a]/50" dir="rtl">
                
                {/* Chat Bubbles */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-700">
                    <User className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <div className="bg-neutral-800 text-white text-sm p-3 rounded-2xl rounded-tr-none max-w-md shadow-sm border border-neutral-700">
                      السلام عليكم، كنت بسأل على سعر اللاب توب الديل الـ XPS 15؟
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1 mr-1">10:41 ص</div>
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(5,150,105,0.3)]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-primary text-white text-sm p-3 rounded-2xl rounded-tl-none max-w-md shadow-sm">
                      وعليكم السلام يا أستاذ محمود! أهلاً بيك في Gates Tech.
                      <br/>سعر اللاب توب Dell XPS 15 حالياً 75,000 جنيه، ومتاح منه نسختين مع كارت شاشة RTX 4060. أقدر أساعدك في تفاصيل المواصفات؟
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1 ml-1">10:41 ص</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-700">
                    <User className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <div className="bg-neutral-800 text-white text-sm p-3 rounded-2xl rounded-tr-none max-w-md shadow-sm border border-neutral-700 border-l-red-500 border-l-2">
                      إيه ده مستحيل! الأسعار دي غالية أوي ومبالغ فيها جداً. بره أرخص منكم بكتير.
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1 mr-1">10:42 ص</div>
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(5,150,105,0.3)]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-primary text-white text-sm p-3 rounded-2xl rounded-tl-none max-w-md shadow-sm border border-emerald-400/30 font-medium">
                      أنا مقدر وجهة نظرك جداً يا أستاذ محمود، والأسعار فعلاً اتغيرت الفترة الأخيرة.
                      لكن حابب أوضحلك إن الجهاز ده بضمان الوكيل الرسمي سنتين، وبنديك معاه شنطة وماوس أوريجينال هدية، بالإضافة لتقسيط بدون فوايد لحد 12 شهر.
                      <br/><br/>ولو حابب ممكن أعرض عليك بدايل ممتازة لنفس الشغل وبأسعار أقل، محتاجه لشغل جرافيك ولا هندسي؟
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1 ml-1">10:42 ص</div>
                  </div>
                </div>

              </div>
              <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex gap-2 items-center">
                 <button className="px-4 py-2 bg-red-900/30 text-red-500 hover:bg-red-900/50 border border-red-900/50 text-sm font-medium rounded transition-colors whitespace-nowrap">
                    Takeover Chat
                 </button>
                 <div className="flex-1 relative">
                   <input type="text" placeholder="Type a message to inject or whisper to AI..." className="w-full bg-[#0a0a0a] border border-neutral-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder-neutral-600" />
                 </div>
                 <button className="p-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors">
                    <Send className="w-4 h-4" />
                 </button>
              </div>
            </>
          ) : selectedChat ? (
             <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
               <Bot className="w-12 h-12 mb-4 opacity-50" />
               <p>Chat viewer loading for ID: {selectedChat}...</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 text-center">
              <AlertOctagon className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-neutral-400 mb-2">No Chat Selected</h3>
              <p className="text-sm">Select an active alert from the left panel to monitor the AI conversation in real-time or take over manually.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
