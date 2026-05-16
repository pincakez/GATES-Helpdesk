import { PageWrapper } from '../components/layout/PageWrapper';
import { Video, Phone, Settings } from 'lucide-react';

export default function Calls() {
  return (
    <PageWrapper 
      title="WebRTC Calls" 
      description="Manage coturn TURN server connections and live remote support sessions."
      action={
        <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-neutral-700">
          <Settings className="w-4 h-4" />
          TURN Configuration
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-neutral-200">Live Active Sessions</span>
            </div>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800 mb-4 cursor-pointer hover:border-neutral-700 hover:bg-neutral-800 transition-all">
                <Video className="w-6 h-6 text-neutral-500" />
             </div>
             <p className="text-neutral-400 text-sm mb-6">No active WebRTC sessions right now.<br/>Start a session from a ticket to guide a user visually.</p>
             <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Initiate Test Call
             </button>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
          <h3 className="font-medium text-neutral-200 border-b border-neutral-800 pb-3">Server Status</h3>
           <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">coturn Server</span>
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">ONLINE</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Signaling Server</span>
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">ONLINE</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Active Relays</span>
              <span className="text-sm font-medium text-neutral-200">0</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
