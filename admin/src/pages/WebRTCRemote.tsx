import React, { useState, useRef, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MonitorPlay, Terminal, Power, MousePointer2, RefreshCw, AlertCircle, MessageSquare, Send, Paperclip, File as FileIcon, Check, CheckCheck } from 'lucide-react';

const mockClients = [
  { id: 'EXT-901', user: 'Karim Ali', status: 'Online', ip: '192.168.1.45', os: 'Windows 11', version: 'v3.1.0' },
  { id: 'EXT-902', user: 'Guest_User_88', status: 'Online', ip: '192.168.1.12', os: 'macOS 14', version: 'v3.1.0' },
  { id: 'EXT-889', user: 'Ahmed Elsayed', status: 'Offline', ip: '10.0.0.99', os: 'Windows 10', version: 'v3.0.9' },
];

type MessageStatus = 'sent' | 'delivered' | 'read';

export default function WebRTCRemote() {
  const [selectedClient, setSelectedClient] = useState<string>('EXT-901');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: string, time: string, isFile?: boolean, fileName?: string, fileSize?: string, status?: MessageStatus}>>([
    { id: 1, text: "Hi Karim, I'm connected to your device now. Let me check what's going on.", sender: 'admin', time: '11:02 AM', status: 'read' },
    { id: 2, text: "Great, thanks. The app keeps freezing every time I try to generate the report.", sender: 'user', time: '11:03 AM' },
    { id: 3, text: "Got it. I'm injecting a debug payload through the console to see the logs. Please try reproducing it again.", sender: 'admin', time: '11:04 AM', status: 'read' }
  ]);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeClient = mockClients.find(c => c.id === selectedClient);

  const simulateMessageFlow = (msgId: number) => {
    // Simulate delivered
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m));
      
      // Simulate read
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
        
        // Simulate remote user typing
        setIsRemoteTyping(true);
        setTimeout(() => {
          setIsRemoteTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Alright, I'll keep an eye out and try again.",
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 3000);
      }, 1500);
    }, 500);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsgId = Date.now();
    setMessages([...messages, { id: newMsgId, text: inputText, sender: 'admin', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' }]);
    setInputText('');
    simulateMessageFlow(newMsgId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMsgId = Date.now();
      setMessages([...messages, { 
        id: newMsgId, 
        text: '', 
        isFile: true,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        sender: 'admin', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      }]);
      simulateMessageFlow(newMsgId);
    }
  };

  return (
    <PageWrapper 
      title="WebRTC Remote Management" 
      description="Control Chrome Extensions and monitor client machines securely via WebRTC Data Channels."
      action={
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
          <MonitorPlay className="w-4 h-4" />
          Broadcast to All
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
        
        {/* Clients List Sidebar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a]/50">
            <h3 className="text-sm font-semibold text-white">Connected Clients</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mockClients.map(client => (
              <div 
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedClient === client.id ? 'bg-neutral-800 border-l-2 border-primary' : 'hover:bg-neutral-800/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">{client.id}</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Online' ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                  </span>
                </div>
                <div className="text-xs text-neutral-400">{client.user}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main View Area */}
        {activeClient ? (
          <div className="col-span-3 flex flex-col gap-6">
            
            {/* Top Toolbar */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  Session: {activeClient.id}
                  <span className="bg-emerald-900/30 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                    Secured
                  </span>
                </h2>
                <div className="text-xs text-neutral-400 mt-1">
                  IP: {activeClient.ip} &bull; OS: {activeClient.os} &bull; Ext Version: {activeClient.version}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Request Screen Capture">
                  <MonitorPlay className="w-4 h-4" />
                </button>
                <button className="p-2 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Take Remote Control">
                  <MousePointer2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Restart Extension">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/30 rounded transition-colors" title="Force Disconnect">
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewport and Chat Split */}
            <div className="flex-1 flex gap-6 min-h-0">
              {/* Screen / Terminal Area */}
              <div className="flex-[2] bg-black border border-neutral-800 rounded-xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <MonitorPlay className="w-32 h-32 text-neutral-600" />
                </div>
                <div className="relative z-10 p-6 flex-1 flex flex-col justify-end">
                   <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-4 rounded-lg w-full mx-auto shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-white flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-500" />
                          Remote Execution Console
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">WebRTC DataChannel Active</span>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded rounded-b-none border border-neutral-800 text-xs font-mono text-neutral-400 h-32 overflow-y-auto">
                        <div>&gt; Initializing connection to EXT-901...</div>
                        <div className="text-emerald-400">&gt; Connection established via STUN.</div>
                        <div>&gt; Waiting for incoming DOM tree stream...</div>
                      </div>
                      <div className="flex bg-[#0a0a0a] border border-t-0 border-neutral-800 p-2 rounded-b">
                        <span className="text-emerald-500 font-mono text-sm mr-2">$</span>
                        <input 
                          type="text" 
                          placeholder="Enter JS payload or command to execute on client..." 
                          className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-white placeholder-neutral-600"
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col min-h-0">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#0a0a0a]/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    Live Support Chat
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-900/20 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`${msg.sender === 'admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-neutral-800 text-white border border-neutral-700 rounded-tl-none'} text-sm p-3 rounded-2xl max-w-[85%] shadow-sm`}>
                        {msg.isFile ? (
                          <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                            <FileIcon className="w-8 h-8 text-white/70" />
                            <div>
                              <div className="font-semibold text-xs overflow-hidden text-ellipsis whitespace-nowrap w-32">{msg.fileName}</div>
                              <div className="text-[10px] text-white/60">{msg.fileSize}</div>
                            </div>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                        {msg.time}
                        {msg.sender === 'admin' && (
                          msg.status === 'sent' ? <Check className="w-3 h-3 text-neutral-500" /> :
                          msg.status === 'delivered' ? <CheckCheck className="w-3 h-3 text-neutral-500" /> :
                          msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : null
                        )}
                      </span>
                    </div>
                  ))}
                  {isRemoteTyping && (
                    <div className="flex flex-col items-start mt-2">
                       <div className="bg-neutral-800 text-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-neutral-700 flex items-center gap-1 w-16 h-10">
                         <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                         <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                         <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></span>
                       </div>
                       <span className="text-[10px] text-neutral-500 mt-1">{activeClient?.user} is typing...</span>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-neutral-800 bg-[#0a0a0a] flex flex-col gap-2">
                  {inputText.length > 0 && <span className="text-[10px] text-neutral-500 h-3 ml-2 italic">You are typing... (remote user sees this across WebRTC)</span>}
                  <div className="flex gap-2 items-center">
                    <input 
                      type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-neutral-800 text-neutral-400 rounded hover:text-white hover:bg-neutral-700 transition-colors flex-shrink-0"
                    title="Send File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type to remote user..." 
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder-neutral-500"
                  />
                  <button onClick={sendMessage} className="p-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-500">
             <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
             <p>Select a client from the sidebar to initialize remote connection.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
